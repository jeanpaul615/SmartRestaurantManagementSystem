import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './products.entity';
import { CurrentUser } from '@decorators/current-user.decorator';
import { Roles } from '@decorators/roles.decorator';
import { Public } from '@decorators/public.decorator';

@ApiTags('products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('admin', 'waiter')
  @ApiOperation({ 
    summary: 'Crear un nuevo producto (Admin/Waiter)',
    description: 'Crea un nuevo producto para un restaurante específico'
  })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      'Hamburguesa': {
        value: {
          name: 'Hamburguesa Clásica',
          description: 'Hamburguesa con queso cheddar, lechuga, tomate y salsa especial',
          price: 12.50,
          stock: 50,
          imageUrl: 'https://example.com/hamburguesa.jpg',
          restaurantId: 1
        }
      },
      'Pizza': {
        value: {
          name: 'Pizza Margherita',
          description: 'Pizza con tomate, mozzarella y albahaca fresca',
          price: 15.00,
          stock: 30,
          imageUrl: 'https://example.com/pizza.jpg',
          restaurantId: 1
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.', type: Product })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Restaurante no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'Obtener todos los productos (Público)',
    description: 'Obtiene todos los productos, opcionalmente filtrados por restaurante'
  })
  @ApiQuery({ 
    name: 'restaurantId', 
    required: false, 
    description: 'Filtrar por ID de restaurante',
    type: Number 
  })
  @ApiResponse({ status: 200, description: 'Lista de productos.', type: [Product] })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll(@Query('restaurantId') restaurantId?: number): Promise<Product[]> {
    return this.productsService.findAll(restaurantId);
  }

  @Get('restaurant/:restaurantId')
  @Public()
  @ApiOperation({ 
    summary: 'Obtener productos por restaurante (Público)',
    description: 'Obtiene todos los productos de un restaurante específico'
  })
  @ApiParam({ name: 'restaurantId', description: 'ID del restaurante', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de productos del restaurante.', type: [Product] })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findByRestaurant(
    @Param('restaurantId', ParseIntPipe) restaurantId: number
  ): Promise<Product[]> {
    return this.productsService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ 
    summary: 'Obtener un producto por ID (Público)',
    description: 'Obtiene los detalles completos de un producto específico'
  })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiResponse({ status: 200, description: 'Detalles del producto.', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'waiter')
  @ApiOperation({ 
    summary: 'Actualizar un producto (Admin/Waiter)',
    description: 'Actualiza la información de un producto existente'
  })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      'Actualizar precio': {
        value: { price: 14.50 }
      },
      'Actualizar stock': {
        value: { stock: 100 }
      },
      'Actualización completa': {
        value: {
          name: 'Hamburguesa Premium',
          description: 'Hamburguesa con queso gourmet, bacon y vegetales frescos',
          price: 16.00,
          stock: 25,
          imageUrl: 'https://example.com/hamburguesa-premium.jpg'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente.', type: Product })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @Roles('admin', 'waiter')
  @ApiOperation({ 
    summary: 'Actualizar stock de un producto (Admin/Waiter)',
    description: 'Incrementa o decrementa el stock de un producto'
  })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          description: 'Cantidad a sumar (positivo) o restar (negativo)',
          example: 10
        }
      }
    },
    examples: {
      'Incrementar stock': {
        value: { quantity: 50 }
      },
      'Decrementar stock': {
        value: { quantity: -10 }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Stock actualizado exitosamente.', type: Product })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number
  ): Promise<Product> {
    return this.productsService.updateStock(id, quantity);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Eliminar un producto (Solo Admin)',
    description: 'Elimina un producto del sistema'
  })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar productos.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.productsService.remove(id);
    return { message: 'Producto eliminado exitosamente' };
  }
}   