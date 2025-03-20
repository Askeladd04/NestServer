import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { VerifyModule } from './verify/verify.module';

@Module({
    imports: [TaskModule, UserModule, AuthModule , JwtModule.register({
        global: true,
        secret: process.env.SECRET_VALUE,
        signOptions: { expiresIn: '20m' }
    }), VerifyModule],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
