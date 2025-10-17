import { Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';

//GUARDS & DECORATORS
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/roles.decorator';


@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    //Create a new user - Solo Admin puede crear usuarios
    @Roles('admin')
    @Post()
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'El usuario ha sido creado.', type: User })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async createUser(
        @Body() dto: CreateUserDto,
        @CurrentUser() user: any
    ): Promise<User> {
        console.log(`Usuario creado por: ${user.username}`);
        return this.usersService.CreateUser(dto);
    }

    //Get all users - Solo Admin puede ver todos los usuarios
    @Roles('admin')
    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida.', type: [User] })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getAllUsers(@CurrentUser() user: any): Promise<User[]> {
        console.log(`Lista de usuarios solicitada por: ${user.username}`);
        return this.usersService.FindAll();
    }

    //Get current user profile - Cualquier usuario autenticado
    @Get('me')
    @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
    @ApiResponse({ status: 200, description: 'Perfil del usuario obtenido.' })
    async getMyProfile(@CurrentUser() user: any) {
        return {
            message: 'Tu perfil',
            user: user
        };
    }

}