import { Body, Controller, Get, Post, Request, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { VerifyDto } from '../verify/dto/verify.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/user.dto';
import { Response } from 'express';
import { VerifyService } from 'src/verify/verify.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly userService: UserService,
        private readonly verifyService: VerifyService,
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    async isAuth(@Request() req) {
        return await this.userService.getUserFromId(req.user.sub);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async signIn(@Body() dto: LoginDto, @Res() res: Response) {
        try {
            const result = await this.auth.login(dto);

            if (result.statusCode === 0) {
                res.cookie('access_token', result.data!.token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60 * 1000,
                    path: '/',
                });

                const { token, ...data } = result.data!;
                return res.status(200).json(data);
            }

            return res.status(400).json(result);
        } catch (e) {
            throw e;
        }
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() dto: CreateUserDto) {
        try {
            return await this.userService.createUser(dto);
        } catch (e) {
            throw e;
        }
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
    async sendVerificationCode(@Body() {email}: {email: string})    {
        try {
            const newCode = await this.verifyService.generateCode(email);
            return await this.verifyService.sendVerifyCode(email, newCode);
        } catch (e) {
            throw e;
        }
    }
}
