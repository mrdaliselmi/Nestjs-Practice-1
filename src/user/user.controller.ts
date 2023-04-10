/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post('signup')
    async SignUp(
        @Body() user: UserSignUpDto,
    ) : Promise<Partial<UserSignUpDto>> {
        return await this.userService.SignUp(user);
    }
    
    @Post('signin')
    async SignIn(
        @Body() credentials: UserSignInDto,
    ){
        return await this.userService.SignIn(credentials);
    }
}
