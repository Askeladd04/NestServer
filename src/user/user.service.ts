import {
    BadRequestException,
    ConflictException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './user.dto';
import { hashCode } from 'utils/hashCode';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(dto: CreateUserDto) {
        const searchUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (searchUser) {
            if (searchUser.name === dto.name) throw new ConflictException();
            if (searchUser.isVerify) {
                const { password, ...user } = searchUser;
                return {
                    statusCode: HttpStatus.OK,
                    message: 'User Verified!',
                    user,
                };
            }
            throw new BadRequestException('User with this email already exists, but not verified.');
        } else {
            const hashedCode = await hashCode(dto.password, 5);
            const newUser = await this.prisma.user.create({ data: { ...dto, isVerify: false, password: hashedCode } });
            if (newUser) {
                return {
                    statusCode: HttpStatus.CREATED,
                    message: 'User created successfully. Verification required.',
                };
            }
            throw new InternalServerErrorException('Failed to create user.');
        }
    }

    async getUserFromId(id: number) {
        return await this.prisma.user.findUnique({ where: { id } });
    }

    getUsers() {
        return this.prisma.user.findMany();
    }

    async deleteAllUser() {
        await this.prisma.user.deleteMany();
    }
}
