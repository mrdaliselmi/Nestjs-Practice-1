/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Delete, Patch, Param, Version, Query, UseGuards} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo';
import { AddTodoDto } from './dto/addtodo.dto';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { SearchTodoDto } from './dto/searchtodo.dto';
import { JwtAuthGuard } from 'src/user/Guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('todo')
export class TodoController {
    private todos = [];
    constructor(private todoService: TodoService) {}

    //search todo with typeorm
    @Get('/search')
    @UseGuards(JwtAuthGuard)
    async searchTodo(
        @Query() param: SearchTodoDto,
        @User() user
        ){
        return await this.todoService.searchTodo(param, user);
    }

    @Get("/all")
    getAllTodos(): Todo[] {
        return this.todoService.getAllTodos();
    }

    // get all todo with typeorm
    @Get('/v2/all')
    @UseGuards(JwtAuthGuard)
    @Version('2')
    async getAllTodosV2(
        @User() user
    ){
        return await this.todoService.getAllTodosV2(user);
    }

    @Get('/all/paginated')
    @UseGuards(JwtAuthGuard)
    async getAllTodosPaginated(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @User() user) {
        return await this.todoService.getAllTodosPaginated(page, limit, user);
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
    @UseGuards(JwtAuthGuard)
    @Version('2')
    async addTodoV2(
        @Body() newTodo: AddTodoDto,
        @User() user
    ){
        return await this.todoService.addTodoV2(newTodo, user);
    }

    @Get(':id')
    getTodoById(@Body('id') id: string) {
        return this.todoService.getTodoById(id);
    }

    // get todo with typeorm
    @Get('/v2/:id')
    @UseGuards(JwtAuthGuard)
    @Version('2')
    async getTodoByIdV2(
        @Param('id') id: string,
        @User() user) {
        return await this.todoService.getTodoByIdV2(id, user);
    }

    @Delete(':id')
    deleteTodoByID(
      @Param('id') id : string,
    ) {
      return this.todoService.deleteTodoById(id);
    }
    
    @Delete('/v2/:id')
    @UseGuards(JwtAuthGuard)
    @Version('2')
    // deleteTodoByIDV2(
    //     @Param('id') id : string,
    // ) {
    //     return this.todoService.deleteTodoByIdV2(id);
    // }
    async softDeleteTodo(
        @Param('id') id : string,
        @User() user
    ) {
        return await this.todoService.softDeleteTodoById(id, user);
    }

    @Get('restore/:id')
    @UseGuards(JwtAuthGuard)
    async restoreTodo(
        @Param('id') id : string,
        @User() user
    ) {
        return await this.todoService.restoreTodoById(id, user);
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
    @UseGuards(JwtAuthGuard)
    @Version('2')
    async updateTodoByIDV2(
        @Param('id') id : string,
        @Body() newTodo: Partial<UpdateTodoDto>,
        @User() user
        ) {
            return await this.todoService.updateTodoByIdV2(id, newTodo, user);
        }


    // @Get('/countall')
    // async countTodo(){
    //     return await this.todoService.countTodo();
    // }

    @Get('/count/:status')
    @UseGuards(JwtAuthGuard)
    async countTodoByStatus(
        @Param('status') status : string,
        @User() user
    ){
        return await this.todoService.countTodoByStatus(status, user);
    }
}
