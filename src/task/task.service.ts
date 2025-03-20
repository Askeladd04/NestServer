import { BadRequestException, HttpCode, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}
    async createTask(title: string, userId: number) {
        try {
            await this.prisma.task.create({ data: { title, userId } });
        } catch (e) {
            throw new BadRequestException();
        }
    }

    async getUserTask(id: number) {
        try {
            const user: any = await this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
            if(!user) throw new BadRequestException
            const {tasks , ...otherData} = user
            return tasks;
        } catch (e) {
            throw new BadRequestException();
        }
    }
}
