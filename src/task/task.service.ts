import { BadRequestException, HttpCode, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}

    async createTask(title: string, userId: number) {
        try {
            await this.prisma.task.create({ data: { title, userId } });
        } catch (e) {
            throw new BadRequestException;
        }
    }

    async getUnique(id: number){
        try{
        const user = await this.prisma.user.findUnique({where: {id} , include: {tasks: true}})
        return user
        }catch(e){
            throw new BadRequestException
        }
    }
}
