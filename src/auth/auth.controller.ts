import { Body, Controller, Get, HttpStatus, Post, Request, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { VerifyDto } from '../verify/dto/verify.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/user.dto';
import { Response } from 'express';
import { VerifyService } from 'src/verify/verify.service';
import { PrismaService } from 'src/prisma.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly userService: UserService,
        private readonly verifyService: VerifyService,
        private readonly prisma: PrismaService
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    async isAuth(@Request() req) {
        return await this.userService.getUserFromId(req.user.sub);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async signIn(@Body() dto: LoginDto, @Res() res: Response) {
        return await this.auth.login(dto , res)
    }

    

    @Post('register')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() dto: CreateUserDto) {
        try {
            return await this.auth.register(dto);
        } catch (e) {
            throw e;
        }
    }

    @Post('refresh_token')
    async refreshToken(){
        
    }

    @Post('verify')
    @UsePipes(new ValidationPipe())
    async checkVerificationCode(@Body() dto: VerifyDto) {
        try {
            return await this.verifyService.checkVerifyCode(dto);
        } catch (e) {
            throw e;
        }
    }

    @Post('verify/send')
    async sendVerificationCode(@Body() {email}: {email: string}) {
            const newCode = await this.verifyService.generateCode();
            const updateUserCode = await this.prisma.user.update({where: {email} , data: {code: newCode.hashedCode}})
            if(updateUserCode){
                try{
                    await this.verifyService.sendVerifyCode(email, newCode.hashedCode);
                    return {statusCode: 0 , message: "Success"}
                }catch(e){
                    throw e
                }
            }else return {statusCode: HttpStatus.FORBIDDEN , message: "User is not register!"}
        }
}
