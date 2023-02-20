/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo';
import { TodoStatusEnum } from './todo-status.enum';
import { AddTodoDto } from './dto/addtodo.tdo';

@Injectable()
export class TodoService {
  todos: Todo[] = [];
  @Inject('UUID') private uuid: ()=> number;
  getAllTodos(): Todo[] {
    return this.todos;
  }

  addTodo(newTodo: AddTodoDto): Todo {
    const {name, description} = newTodo;
    let id;
    if (this.todos.length) {
       id = this.uuid;
    } else {
       id = 1;
    }

    const todo = {
      id,
      name,
      description,
      createdDate: new Date(),
      status: TodoStatusEnum.waiting,
    };
    this.todos.push(todo);
    return todo;
  }

  getTodoById(id: number): Todo {
    const todo = this.todos.find((actualTodo) => actualTodo.id === +id);
    if (todo) return todo;
    throw new NotFoundException(`todo of id ${id} not found`);
  }

  deleteTodoById(id: number){
    const todo = this.todos.find((todo) => todo.id === +id);
    if (!todo) {
      throw new NotFoundException(`Todo of id ${id} not found`);
    } else {
      this.todos = this.todos.filter((todo) => todo.id !== +id);
    }
    return {
        message : `todo of id ${id} is deleted`,
        count: 1
      };
  }

  updateTodoById(id: number, newTodo: Partial<Todo>) {
    const todo = this.getTodoById(id);
    todo.description = newTodo.description ??newTodo.description;
    todo.name = newTodo.name ? newTodo.name : todo.name;
    return todo;
  }
}
