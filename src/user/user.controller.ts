import { Body, Controller, Delete, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly prisma: PrismaService,
    ) {}


    @Get('all')
    async getCheck() {
        return this.prisma.user.findMany();
    }

    @Delete('all')
    deleteAllUser() {
        this.userService.deleteAllUser();
        return 'all user deleted!!';
    }
}
