import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  ParseIntPipe 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiParam
} from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { Public } from '../auth';

@ApiTags('restaurant')
@ApiBearerAuth('JWT-auth')
@Controller('restaurant')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Post()
    @Roles('admin')
    @ApiOperation({ 
        summary: 'Crear un nuevo restaurante (Solo Admin)',
        description: 'Crea un nuevo restaurante en el sistema'
    })
    @ApiBody({ 
        type: CreateRestaurantDto,
        examples: {
            'Restaurante colombiano': {
                value: {
                    name: 'La Casa del Sabor',
                    address: 'Calle 123 #45-67, Bogotá',
                    phone: '+57 300 123 4567',
                    description: 'Restaurante especializado en comida colombiana',
                    userId: 1
                }
            },
            'Restaurante italiano': {
                value: {
                    name: 'Bella Italia',
                    address: 'Carrera 7 #50-30, Medellín',
                    phone: '+57 310 987 6543',
                    description: 'Auténtica comida italiana con recetas tradicionales',
                    userId: 1
                }
            }
        }
    })
    @ApiResponse({ status: 201, description: 'Restaurante creado exitosamente.', type: Restaurant })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden crear restaurantes.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        return this.restaurantService.create(createRestaurantDto);
    }

    @Get()
    @Public()
    @ApiOperation({ 
        summary: 'Obtener todos los restaurantes (Público)',
        description: 'Obtiene la lista de todos los restaurantes'
    })
    @ApiResponse({ status: 200, description: 'Lista de restaurantes.', type: [Restaurant] })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async findAll(): Promise<Restaurant[]> {
        return this.restaurantService.findAll();
    }

    @Get('user/:userId')
    @Roles('admin')
    @ApiOperation({ 
        summary: 'Obtener restaurantes por usuario (Solo Admin)',
        description: 'Obtiene todos los restaurantes asociados a un usuario específico'
    })
    @ApiParam({ name: 'userId', description: 'ID del usuario', type: Number })
    @ApiResponse({ status: 200, description: 'Lista de restaurantes del usuario.', type: [Restaurant] })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Restaurant[]> {
        return this.restaurantService.findByUser(userId);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ 
        summary: 'Obtener un restaurante por ID (Público)',
        description: 'Obtiene la información detallada de un restaurante específico'
    })
    @ApiParam({ name: 'id', description: 'ID del restaurante', type: Number })
    @ApiResponse({ status: 200, description: 'Información del restaurante.', type: Restaurant })
    @ApiResponse({ status: 404, description: 'Restaurante no encontrado.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Restaurant> {
        return this.restaurantService.findOne(id);
    }

    @Patch(':id')
    @Roles('admin')
    @ApiOperation({ 
        summary: 'Actualizar un restaurante (Solo Admin)',
        description: 'Actualiza la información de un restaurante existente'
    })
    @ApiParam({ name: 'id', description: 'ID del restaurante', type: Number })
    @ApiBody({
        type: UpdateRestaurantDto,
        examples: {
            'Actualizar nombre': {
                value: { name: 'La Casa del Sabor Renovada' }
            },
            'Actualizar dirección y teléfono': {
                value: {
                    address: 'Calle 456 #78-90, Medellín',
                    phone: '+57 310 987 6543'
                }
            },
            'Actualización completa': {
                value: {
                    name: 'Nuevo Nombre',
                    address: 'Nueva Dirección 123',
                    phone: '+57 300 111 2222',
                    description: 'Nueva descripción del restaurante'
                }
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Restaurante actualizado exitosamente.', type: Restaurant })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar restaurantes.' })
    @ApiResponse({ status: 404, description: 'Restaurante no encontrado.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRestaurantDto: UpdateRestaurantDto
    ): Promise<Restaurant> {
        return this.restaurantService.update(id, updateRestaurantDto);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ 
        summary: 'Eliminar un restaurante (Solo Admin)',
        description: 'Elimina un restaurante del sistema'
    })
    @ApiParam({ name: 'id', description: 'ID del restaurante', type: Number })
    @ApiResponse({ status: 200, description: 'Restaurante eliminado exitosamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar restaurantes.' })
    @ApiResponse({ status: 404, description: 'Restaurante no encontrado.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        await this.restaurantService.remove(id);
        return { message: 'Restaurante eliminado exitosamente' };
    }
}