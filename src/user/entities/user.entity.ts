import { Time } from "src/common/time";
import { TodoEntity } from "src/todo/entities/todo.entity";
import { UserRole } from "src/common/user-role.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class UserEntity extends Time{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length:50,
        unique:true,
    })
    username: string;

    @Column({
        unique:true,
    })
    email: string;

    @Column()
    password: string;

    @Column()
    salt : string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role : string;


    @OneToMany(
        (type) => TodoEntity,
        (todo) => todo.user,
        {
            cascade: ['insert', 'update']
        }
    )
    todos : TodoEntity[];
}