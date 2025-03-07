import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  NestFactory.create(AppModule , {abortOnError: false})
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
