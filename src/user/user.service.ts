import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserSignUpDto } from './dto/user-signup.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/user-role.enum';
@Injectable()
export class UserService {
    constructor(
         @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {}

    // sign up a new user
    async SignUp(userData: UserSignUpDto) : Promise<Partial<UserEntity>>{

        const user = this.userRepository.create({
            ...userData,
        });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(userData.password, user.salt);
        try {
            await this.userRepository.save(user);
        } catch (error) {
            // throw new ConflictException('Username or email already exists');
            console.log(error);
        }
        return {
            "id":user.id,
            "email":user.email,
            "username":user.username,
            "role":user.role,
        };
    }
    
    // sign in a user
    async SignIn(credentials: UserSignInDto){
        const user = await this.userRepository.findOne({
            where: [
                { username: credentials.username,},
                { email: credentials.username },
            ],
        });
        if(!user){
            throw new NotFoundException('Username or email not found');
        }
        const passwordHash = await bcrypt.hash(credentials.password, user.salt);
        if(passwordHash === user.password){
            const payload = {
                id:user.id,
                email:user.email,
                username:user.username,
                role:user.role,
            }
            const token = this.jwtService.sign(payload);
            return {
                "access_token":token,
            };
        }else{
            throw new NotFoundException('Password is incorrect');
        }
    }

    isOwnerOrAdmin(object, user) {
        return user.role === UserRole.ADMIN || (object.user && object.user.id === user.id);
    }

}
