/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Todo } from './entities/todo';
import { TodoStatusEnum } from './todo-status.enum';
import { AddTodoDto } from './dto/addtodo.dto';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { TodoEntity } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SearchTodoDto } from './dto/searchtodo.dto';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/common/user-role.enum';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  constructor(
    @Inject('uuid') private readonly uuid,
    @InjectRepository(TodoEntity)
    private todoRepository : Repository<TodoEntity>,
    private readonly userService: UserService,
  ) {}

  getAllTodos(): Todo[] {
    return this.todos;
  }

  async getAllTodosV2(user){
    if(user.role === 'admin')
      return await this.todoRepository.find();
    return await this.todoRepository.find({where : {user :{id : user.id}}});
  }

  async getAllTodosPaginated(page = 1, limit = 10, user) {
    let todos, total;
    if (user.role === 'admin') {
      [todos, total] = await this.todoRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
    } else {
      [todos, total] = await this.todoRepository.findAndCount({
        where: {user :{id : user.id}},
        skip: (page - 1) * limit,
        take: limit,
      });
    }
    return {
      page,
      limit,
      total,
      data: todos,
    };
  }

  getTodoById(id: string): Todo {
    const todo = this.todos.find((actualTodo) => actualTodo.id === id);
    if (todo) return todo;
      throw new NotFoundException(`todo of id ${id} not found`);
  }

  addTodo(newTodo: AddTodoDto): Todo {
    const {name, description} = newTodo;
    const id = this.uuid();
    const todo = {
      id,
      name,
      description,
      createdAt: new Date(),
      status: TodoStatusEnum.waiting,
    };
    this.todos.push(todo);
    return todo;
  }

  // add todo with typeorm
  async addTodoV2(newTodo: AddTodoDto, user){
    const todo = this.todoRepository.create(newTodo);
    todo.user = user;
    return await this.todoRepository.save(todo);
  }

  deleteTodoById(id: string){
    const todo = this.getTodoById(id);
    if (todo) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    }
    return {
        message : `todo of id ${id} is deleted`,
        count: 1
      };
  }

  // delete todo with typeorm

  // async deleteTodoByIdV2(id: string){
  //   return await this.todoRepository.delete(id);
  // }
  async softDeleteTodoById(id: string, user){
    const todo = await this.getTodoByIdV2(id, user);
    if (this.userService.isOwnerOrAdmin(todo, user))
      return await this.todoRepository.softDelete(id);
    throw new UnauthorizedException('You are not allowed to delete this todo');
  }

  async restoreTodoById(id: string, user){
    const todo = await this.getTodoByIdV2(id, user);
    if (this.userService.isOwnerOrAdmin(todo, user))
      return await this.todoRepository.restore(id);
    throw new UnauthorizedException('You are not allowed to restore this todo');
  }

  updateTodoById(id: string, newTodo: Partial<UpdateTodoDto>) {
    const todo = this.getTodoById(id);
    todo.description = newTodo.description ??newTodo.description;
    todo.name = newTodo.name ? newTodo.name : todo.name;
    todo.status = newTodo.status ? newTodo.status : todo.status;
    return todo;
  }

  // update todo with typeorm
  async updateTodoByIdV2(id: string, newTodo: Partial<UpdateTodoDto>, user){
    const todo = await this.getTodoByIdV2(id, user);
    if (this.userService.isOwnerOrAdmin(todo, user))
      return await this.todoRepository.update(id, newTodo);
    throw new UnauthorizedException('You are not allowed to update this todo');
  }

  async countTodoByStatus(status: any, user){
    if(user.role === 'admin')
      return await this.todoRepository.count({where : {status : status}});
    return await this.todoRepository.count({where : {status : status, user : {id : user.id}}});
  }

  // async countTodo() {
  //   const counts = {} ;
  //   const statuses = Object.values(TodoStatusEnum) ;
  //   for(const status of statuses){
  //       counts[status] = await this.todoRepository.count({where : {status : status}}) ;
  //   }
  //   return counts ;
  // }

  async searchTodo(param: SearchTodoDto, user){
    let whereClause = {};
    if (user.role === 'user') {
      whereClause = { user: user.id };
    }
    if (param.status) {
      whereClause = { ...whereClause, status: param.status };
    }
    if (param.criteria) {
      whereClause = {
        ...whereClause,
        or: [
          { name: Like(`%${param.criteria}%`) },
          { description: Like(`%${param.criteria}%`) },
        ],
      };
    }
    return await this.todoRepository.find({ where: whereClause });
  }

  async getTodoByIdV2(id: string, user){
    const todo = await this.todoRepository.findOne({where : {id : id}});
    if(!todo) throw new NotFoundException(`todo of id ${id} not found`);
    if (this.userService.isOwnerOrAdmin(todo, user))
      return todo;
    throw new UnauthorizedException('Unauthorized');
  }


}
