import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateTasksDto } from './task.dto';

@Controller('task')
export class TaskController {
    constructor(private readonly taksService: TaskService) {}


    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe)
    async createTasK(@Body() {title}: CreateTasksDto , @Request() req){
      try{
        await this.taksService.createTask(title , req.user.sub)
      }catch(e){
        throw e
      }
    }


    @Get()
    @UseGuards(AuthGuard)
    async getAll(@Request() req){
        return await this.taksService.getUnique(req.user.sub)
    }
}
