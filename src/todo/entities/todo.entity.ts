import { Time } from "src/common/time";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { TodoStatusEnum } from "../todo-status.enum";
import { UserEntity } from "src/user/entities/user.entity";

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
    @ManyToOne(
        (type) => UserEntity,
        (user) => user.todos,
        {
            cascade: ['insert', 'update'],
            eager: true,
        }
    )
    user : UserEntity;
}