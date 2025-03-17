import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTasksDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}
