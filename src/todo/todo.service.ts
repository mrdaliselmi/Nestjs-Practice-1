/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo';
import { TodoStatusEnum } from './todo-status.enum';
import { AddTodoDto } from './dto/addtodo.dto';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { TodoEntity } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SearchTodoDto } from './dto/searchtodo.dto';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  constructor(@Inject('uuid') private readonly uuid,
  @InjectRepository(TodoEntity)
  private todoRepository : Repository<TodoEntity>) {}

  getAllTodos(): Todo[] {
    return this.todos;
  }

  async getAllTodosV2(){
    return await this.todoRepository.find();
  }

  async getAllTodosPaginated(page = 1, limit = 10) {
    const [todos, total] = await this.todoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
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
  async addTodoV2(newTodo: AddTodoDto){
    return await this.todoRepository.save(newTodo);
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
  async softDeleteTodoById(id: string){
    return await this.todoRepository.softDelete(id);
  }

  async restoreTodoById(id: string){
    return await this.todoRepository.restore(id);
  }

  updateTodoById(id: string, newTodo: Partial<UpdateTodoDto>) {
    const todo = this.getTodoById(id);
    todo.description = newTodo.description ??newTodo.description;
    todo.name = newTodo.name ? newTodo.name : todo.name;
    todo.status = newTodo.status ? newTodo.status : todo.status;
    return todo;
  }

  // update todo with typeorm
  async updateTodoByIdV2(id: string, newTodo: Partial<UpdateTodoDto>){
    return await this.todoRepository.update(id, newTodo);
  }

  async countTodoByStatus(status: any){
    return await this.todoRepository.count({where : {status : status}});
  }

  // async countTodo() {
  //   const counts = {} ;
  //   const statuses = Object.values(TodoStatusEnum) ;
  //   for(const status of statuses){
  //       counts[status] = await this.todoRepository.count({where : {status : status}}) ;
  //   }
  //   return counts ;
  // }

  async searchTodo(param: SearchTodoDto){
    if(param.status || param.criteria)
      return this.todoRepository.find(
        {where : [{status : param.status},
                  {name : Like(`%${param.criteria}%`)},
                  {description: Like(`%${param.criteria}%`)}]},) ;
    return this.todoRepository.find() ;
  }

  async getTodoByIdV2(id: string){
    const todo = await this.todoRepository.findOne({where : {id : id}});
    if(!todo) throw new NotFoundException(`todo of id ${id} not found`);
    return todo;
  }


}
