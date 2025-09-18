import { Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }
    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.CreateUser(dto);
    }

}