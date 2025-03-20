import * as nodemailer from 'nodemailer';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { hashCode } from 'utils/hashCode';
import { PrismaService } from 'src/prisma.service';
import { VerifyDto } from './dto/verify.dto';
import { checkHashCode } from 'utils/checkHashCode';

@Injectable()
export class VerifyService {
    constructor(private readonly prisma: PrismaService) {}
    async sendVerifyCode(email: string, code: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'merdanov1605@gmail.com',
                pass: 'zsjk bmjb yybk mwqx', 
            },
        });
        try {
           const info =  await transporter.sendMail({
                from: 'merdanov1605@gmail.com',
                to: email,
                subject: 'Your verification code!!',
                text: `${code}`,
            });
            console.log(info)
            if(!info.messageId) throw new BadRequestException()
            return true;
        } catch (error) {
            throw new BadRequestException();
        }
    }

    async generateCode() {
        const code = Math.random().toString(10).substring(2, 8);
        const hashedCode = await hashCode(code, 5);
        return {code , hashedCode};
    }

    async checkVerifyCode({ email, code }: VerifyDto) {
        const result = await this.prisma.user.findUnique({ where: { email } });
        if (!result) throw new BadRequestException;
        const isCodeValid = await checkHashCode(code, result.code!);
        if (isCodeValid) {
            await this.prisma.user.update({ where: { email }, data: { isVerify: true } });
            return {statusCode: HttpStatus.OK , message: "Success"}
        }
        throw new BadRequestException();
    }
}
