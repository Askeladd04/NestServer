
import { Controller, Get } from '@nestjs/common';

@Controller('animal')
export class CatsController {
  @Get('cats')
  findAll(): string {
    return 'This action returns all cats';
  }
 

  @Get('dogs')
  getBreed(){
    return 'This action returns all dogs'
  }

  @Get('all')
  getAllAnimal(){
    return ['cats' , 'dog']
  }
}
