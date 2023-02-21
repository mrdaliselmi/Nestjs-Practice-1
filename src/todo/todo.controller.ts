/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Delete, Put, Patch, Param} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo';
import { AddTodoDto } from './dto/addtodo.tdo';

@Controller('todo')
export class TodoController {
    private todos = [];
    constructor(private todoService: TodoService) {}

    @Get("/all")
    getAllTodos(): Todo[] {
        return this.todoService.getAllTodos();
    }

    @Post()
    addTodo(
        @Body() newTodo: AddTodoDto,
    ): Todo {
        return (<Todo>this.todoService.addTodo(newTodo));
    }

    @Get(':id')
    getTodoById(@Body('id') id: string) {
        return this.todoService.getTodoById(id);
    }

    @Delete(':id')
    deleteTodoByID(
      @Param('id') id : string,
    ) {
      return this.todoService.deleteTodoById(id);
    }

    @Put(':id')
    updateTodoById(
        @Param('id') id : string,
        @Body() newTodo: Partial<AddTodoDto>
    ){
        return this.todoService.updateTodoById(id, newTodo);
    }
    
    @Patch(':id')
    updateTodoByID(
        @Param('id') id : string,
        @Body() newTodo: Partial<AddTodoDto>
      ) {
          return this.todoService.updateTodoById(id, newTodo);
      }
}
