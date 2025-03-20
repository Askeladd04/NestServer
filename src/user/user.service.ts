import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    // async forgotPassword() {
    //     // check user exists
    //     // proceed
    //     // return true
    // }

    async getUserFromId(id: number) {
        return await this.prisma.user.findUnique({ where: { id } });
    }

    getUsers() {
        return this.prisma.user.findMany();
    }

    async deleteAllUser() {
       return  await this.prisma.user.deleteMany();
    }
}
