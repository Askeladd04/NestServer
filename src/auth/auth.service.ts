import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { checkHashCode } from 'utils/checkHashCode';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/user.dto';
import { VerifyService } from 'src/verify/verify.service';
import { hashCode } from 'utils/hashCode';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly verifyService: VerifyService,
    ) {}

    async signJwt({ email, password }: LoginDto) {
        const getUser: User | null = await this.prisma.user.findUnique({ where: { email } });
        if (!getUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (!getUser.isVerify) throw new HttpException('User is not verified', HttpStatus.FORBIDDEN);
        const checkPassword = await checkHashCode(password, getUser.password);
        if (checkPassword) {
            const { password, ...user } = getUser;
            const payload = { sub: getUser.id, name: getUser.name };
            const access_token = await this.jwtService.signAsync(payload);
            const refresh_token = await this.jwtService.signAsync(payload);
            return { statusCode: 0, message: 'Login is Success', data: { ...user, access_token, refresh_token } };
        }
        return { statusCode: 1, message: 'Incorrect password' };
    }

    async login(dto: LoginDto, res) {
        try {
            const result = await this.signJwt(dto);

            if (result.statusCode === 0) {
                res.cookie('access_token', result.data!.access_token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60 * 1000,
                    path: '/',
                });
                res.cookie('refresh_token', result.data!.refresh_token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 864000000,
                    path: 'auth/refresh_token',
                });

                const { access_token, refresh_token, ...data } = result.data!;
                return res.status(200).json(data);
            }

            return res.status(400).json(result);
        } catch (e) {
            throw e;
        }
    }

    async register(dto: CreateUserDto) {
        const getCode = await this.verifyService.generateCode();
        const hashPassword = await hashCode(dto.password)
        const searchUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        const uniqueName = await this.prisma.user.findUnique({ where: { name: dto.name } });
        if (!searchUser) {
            if (!uniqueName) {
                try {
                    await this.verifyService.sendVerifyCode(dto.email, getCode.code);
                    const newUser = await this.prisma.user.create({ data: { ...dto, password: hashPassword , code: getCode.hashedCode } });
                    return { statusCode: 0, newUser };
                } catch (e) {
                    throw e;
                }
            }else throw new ConflictException();
        } else if(searchUser.isVerify){
          return  {statusCode: 1 , message: "User already registered"}
        }
        // get generated code
        // check user exists
        // send email
        // user create
        // return user
    }

    async refreshToken() {}
}
