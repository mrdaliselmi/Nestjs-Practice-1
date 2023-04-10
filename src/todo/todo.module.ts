/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { UserModule } from 'src/user/user.module';
@Global()
@Module({
    imports:[
        TypeOrmModule.forFeature(
            [TodoEntity]
        ),
        UserModule
    ],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule {}
