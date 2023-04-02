import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { First } from './first/first.module';
import { TodoModule } from './todo/todo.module';
import { CommonModule } from './common/common.module';
import { FirstController } from './first/first.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TodoEntity } from './todo/entities/todo.entity';
dotenv.config();
@Module({
  imports: [First, TodoModule, CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [TodoEntity],
      synchronize: true,
    }),],
  controllers: [
        FirstController, AppController],
  providers: [AppService],
})
export class AppModule {}
