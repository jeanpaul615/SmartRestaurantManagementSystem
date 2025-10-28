import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

import { RestaurantService } from "./restaurant.service";
import { Restaurant } from "./restaurant.entity";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";

//GUARDS & DECORATORS
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { Public } from '../auth';

@ApiTags('restaurant')
@ApiBearerAuth('JWT-auth')  // ✅ Agregar autenticación JWT a todo el controlador
@Controller('restaurant')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {
    }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo restaurante' })
  @ApiBody({ type: CreateRestaurantDto }) // ✅ Para mostrar los parámetros del body en Swagger
  @ApiResponse({ status: 201, description: 'El restaurante ha sido creado.', type: Restaurant })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async createRestaurant(
    @Body() dto: CreateRestaurantDto,
    @CurrentUser() user?: any, // opcional si deseas asociar el restaurante al usuario autenticado
  ): Promise<Restaurant> {
    return this.restaurantService.CreateRestaurant(dto);
  }
    
    @Roles('admin')
    @Get(':id')
    @ApiOperation({ summary: 'Consultar un restaurante por ID' })
    @ApiResponse({ status: 200, description: 'Consulta de restaurantes ejecutada', type: Restaurant })
        @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
        @ApiResponse({ status: 401, description: 'No autorizado.' })
        @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
        @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
         async getRestaurant(@Param('id') id: number) {
        return this.restaurantService.FindById(id);
        }
}