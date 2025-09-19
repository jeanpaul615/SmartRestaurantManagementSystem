import { Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';


@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    //Create a new user
    @Post()
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'El usuario ha sido creado.', type: User })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async createUser(@Body() dto: CreateUserDto): Promise<User> {
        return this.usersService.CreateUser(dto);
    }

    //Get all users
    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida.', type: [User] })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getAllUsers(): Promise<User[]> {
        return this.usersService.FindAll();
    }

}