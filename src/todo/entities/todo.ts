/* eslint-disable prettier/prettier */
import { TodoStatusEnum } from "../todo-status.enum";

export class Todo {
    id: string;
    name: string;
    description: string;
    createdDate: Date;
    status: TodoStatusEnum;
}
