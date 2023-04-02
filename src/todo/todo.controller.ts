/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Delete, Patch, Param, Version, Query} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo';
import { AddTodoDto } from './dto/addtodo.dto';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { SearchTodoDto } from './dto/searchtodo.dto';

@Controller('todo')
export class TodoController {
    private todos = [];
    constructor(private todoService: TodoService) {}

    //search todo with typeorm
    @Get('/search')
    async searchTodo(@Query() param: SearchTodoDto){
        return await this.todoService.searchTodo(param);
    }

    @Get("/all")
    getAllTodos(): Todo[] {
        return this.todoService.getAllTodos();
    }

    // get all todo with typeorm
    @Get('/v2/all')
    @Version('2')
    async getAllTodosV2(){
        return await this.todoService.getAllTodosV2();
    }

    @Get('/all/paginated')
    async getAllTodosPaginated(
        @Query('page') page = 1,
        @Query('limit') limit = 10,) {
        return await this.todoService.getAllTodosPaginated(page, limit);
    }

    @Post()
    @Version('1')
    addTodo(
        @Body() newTodo: AddTodoDto,
    ): Todo {
        return (<Todo>this.todoService.addTodo(newTodo));
    }

    // add todo with typeorm
    @Post('/v2')
    @Version('2')
    async addTodoV2(
        @Body() newTodo: AddTodoDto,
    ){
        return await this.todoService.addTodoV2(newTodo);
    }

    @Get(':id')
    getTodoById(@Body('id') id: string) {
        return this.todoService.getTodoById(id);
    }

    // get todo with typeorm
    @Get('/v2/:id')
    @Version('2')
    async getTodoByIdV2(@Body('id') id: string) {
        return await this.todoService.getTodoByIdV2(id);
    }

    @Delete(':id')
    deleteTodoByID(
      @Param('id') id : string,
    ) {
      return this.todoService.deleteTodoById(id);
    }
    
    @Delete('/v2/:id')
    @Version('2')
    // deleteTodoByIDV2(
    //     @Param('id') id : string,
    // ) {
    //     return this.todoService.deleteTodoByIdV2(id);
    // }
    async softDeleteTodo(
        @Param('id') id : string,
    ) {
        return await this.todoService.softDeleteTodoById(id);
    }

    @Get('restore/:id')
    async restoreTodo(
        @Param('id') id : string,
    ) {
        return await this.todoService.restoreTodoById(id);
    }

    @Patch(':id')
    updateTodoByID(
        @Param('id') id : string,
        @Body() newTodo: Partial<UpdateTodoDto>
        ) {
          return this.todoService.updateTodoById(id, newTodo);
        }
    
    // update todo with typeorm
    @Patch('/v2/:id')
    @Version('2')
    async updateTodoByIDV2(
        @Param('id') id : string,
        @Body() newTodo: Partial<UpdateTodoDto>
        ) {
            return await this.todoService.updateTodoByIdV2(id, newTodo);
        }


    // @Get('/countall')
    // async countTodo(){
    //     return await this.todoService.countTodo();
    // }

    @Get('/count/:status')
    async countTodoByStatus(
        @Param('status') status : string,
    ){
        return await this.todoService.countTodoByStatus(status);
    }
}
