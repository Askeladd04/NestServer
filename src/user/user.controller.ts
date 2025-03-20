import { Controller, Delete, Get, } from '@nestjs/common';
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
        return await this.prisma.user.findMany();
    }

    @Delete('all')
   async deleteAllUser() {
        await this.userService.deleteAllUser();
        return 'all user deleted!!';
    }
}
