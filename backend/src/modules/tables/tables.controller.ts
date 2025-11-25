import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { Tables } from './tables.entity';
import { TablesService } from './tables.service';
//DTOs
import { CreateTableDto } from './dto/create-tables.dto';

//GUARDS & DECORATORS
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/roles.decorator';

@ApiTags('tables')
@ApiBearerAuth('JWT-auth') // ✅ Agregar autenticación JWT a todo el controlador
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}
  //Create a new table - Solo Admin puede crear mesas
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Crear una nueva mesa' })
  @ApiResponse({ status: 201, description: 'La mesa ha sido creada.', type: Tables })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async createTable(@Body() dto: CreateTableDto, @CurrentUser() user: any): Promise<Tables> {
    console.log(`Mesa creada por: ${user.username}`);
    return this.tablesService.CreateTable(dto);
  }
  //Get all tables - Cualquier usuario autenticado puede ver las mesas
  @Get()
  @ApiOperation({ summary: 'Obtener todas las mesas' })
  @ApiResponse({ status: 200, description: 'Lista de mesas obtenida.', type: [Tables] })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getAllTables(@CurrentUser() user: any): Promise<Tables[]> {
    console.log(`Lista de mesas solicitada por: ${user.username}`);
    return this.tablesService.FindAll();
  }
}
