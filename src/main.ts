import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
    NestFactory.create(AppModule, { abortOnError: false });
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'http://localhost:3000', 
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
        credentials: true, 
      });
    app.use(cookieParser());
    await app.listen(4000);
}
bootstrap();
