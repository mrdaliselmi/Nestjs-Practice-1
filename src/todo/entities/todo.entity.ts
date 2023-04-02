import { Time } from "src/common/time";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TodoStatusEnum } from "../todo-status.enum";

@Entity('todo')
export class TodoEntity extends Time {
    @PrimaryGeneratedColumn()
    id: string;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column({ type: 'enum', enum: TodoStatusEnum, default: TodoStatusEnum.waiting})
    status: TodoStatusEnum;
}