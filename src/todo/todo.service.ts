/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo';
import { TodoStatusEnum } from './todo-status.enum';
import { AddTodoDto } from './dto/addtodo.tdo';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  constructor(@Inject('uuid') private readonly uuid) {}
  getAllTodos(): Todo[] {
    return this.todos;
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
      createdDate: new Date(),
      status: TodoStatusEnum.waiting,
    };
    this.todos.push(todo);
    return todo;
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

  updateTodoById(id: string, newTodo: Partial<Todo>) {
    const todo = this.getTodoById(id);
    todo.description = newTodo.description ??newTodo.description;
    todo.name = newTodo.name ? newTodo.name : todo.name;
    return todo;
  }
}
