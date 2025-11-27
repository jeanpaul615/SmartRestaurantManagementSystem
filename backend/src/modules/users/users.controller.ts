import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole, UserStatus } from './users.entity';
import { CurrentUser } from '@decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Roles } from '@decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Crear un nuevo usuario (Solo Admin)',
    description: 'Crea un nuevo usuario en el sistema',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      'Usuario cliente': {
        value: {
          username: 'john_doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'customer',
        },
      },
      'Usuario mesero': {
        value: {
          username: 'jane_waiter',
          email: 'jane@example.com',
          password: 'password123',
          role: 'waiter',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.', type: User })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden crear usuarios.' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener todos los usuarios (Solo Admin)',
    description: 'Obtiene todos los usuarios, opcionalmente filtrados por rol o estado',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Filtrar por rol',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: UserStatus,
    description: 'Filtrar por estado',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.', type: [User] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden ver todos los usuarios.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll(
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
  ): Promise<User[]> {
    return this.usersService.findAll(role, status);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Obtener perfil del usuario actual',
    description: 'Obtiene la información del usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Perfil del usuario.', type: User })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getMyProfile(@CurrentUser() user: AuthenticatedUser): Promise<User> {
    return this.usersService.findOne(user.id);
  }

  @Get('role/:role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener usuarios por rol (Solo Admin)',
    description: 'Obtiene todos los usuarios con un rol específico',
  })
  @ApiParam({
    name: 'role',
    enum: UserRole,
    description: 'Rol a filtrar',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios con ese rol.', type: [User] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findByRole(@Param('role') role: UserRole): Promise<User[]> {
    return this.usersService.findByRole(role);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener un usuario por ID (Solo Admin)',
    description: 'Obtiene la información de un usuario específico',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiResponse({ status: 200, description: 'Información del usuario.', type: User })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Actualizar mi perfil',
    description: 'Actualiza la información del usuario autenticado',
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      'Actualizar nombre': {
        value: { username: 'new_username' },
      },
      'Actualizar email': {
        value: { email: 'newemail@example.com' },
      },
      'Cambiar contraseña': {
        value: { password: 'newPassword123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente.', type: User })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Usuarios no admin no pueden cambiar su propio rol
    if (user.role !== UserRole.ADMIN) {
      delete updateUserDto.role;
      delete updateUserDto.status;
    }
    return this.usersService.update(user.id, updateUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Actualizar un usuario (Solo Admin)',
    description: 'Actualiza la información de un usuario específico',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      'Cambiar rol': {
        value: { role: 'waiter' },
      },
      'Desactivar usuario': {
        value: { status: 'inactive' },
      },
      'Actualización completa': {
        value: {
          username: 'updated_username',
          email: 'updated@example.com',
          role: 'chef',
          status: 'active',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.', type: User })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar usuarios.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Desactivar un usuario (Solo Admin)',
    description: 'Cambia el estado del usuario a "inactive"',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario desactivado exitosamente.', type: User })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Activar un usuario (Solo Admin)',
    description: 'Cambia el estado del usuario a "active"',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario activado exitosamente.', type: User })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async activate(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.activate(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar un usuario (Solo Admin)',
    description: 'Elimina un usuario del sistema',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar usuarios.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'Usuario eliminado exitosamente' };
  }
}
