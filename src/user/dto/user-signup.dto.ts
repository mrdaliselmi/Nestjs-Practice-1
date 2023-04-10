import { IsEmail, IsNotEmpty } from "class-validator";

export class UserSignUpDto {
    @IsNotEmpty()
    username: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}