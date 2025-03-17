import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { VerifyService } from 'src/verify/verify.service';



export type Response = {
    statusCode: number;
    message: string;
};

@Module({
    imports: [JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '20m' }
        })],
    providers: [AuthService  , UserService , PrismaService, VerifyService],
    controllers: [AuthController],
})
export class AuthModule {}
