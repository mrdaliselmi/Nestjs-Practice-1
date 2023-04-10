import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategy/passport-jwt.stategy';
dotenv.config();
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({defaultStrategy: 'jwt' },),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { 
                expiresIn: '1d',
            },
        }),
    ],
    controllers: [
        UserController, 
    ],
    providers: [UserService, JwtStrategy],
    exports: [UserService],
})
export class UserModule {}
