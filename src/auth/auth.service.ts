import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { checkHashCode } from 'utils/checkHashCode';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async login({ email, password }: LoginDto) {
        const getUser: User | null = await this.prisma.user.findUnique({ where: { email } });
        if (!getUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (!getUser.isVerify) throw new HttpException('User is not verified', HttpStatus.FORBIDDEN);
        const checkPassword = await checkHashCode(password, getUser.password);
        if (checkPassword) {
            const { password, ...user } = getUser;
            const payload = { sub: getUser.id, name: getUser.name };
            const token = await this.jwtService.signAsync(payload);
            return { statusCode: 0, message: 'Login is Success', data: { ...user, token } };
        }
        return { statusCode: 1, message: 'Incorrect password' };
    }
}
