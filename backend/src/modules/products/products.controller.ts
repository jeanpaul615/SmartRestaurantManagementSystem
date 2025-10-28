import { Controller, Get, Post, Delete, Put, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { Product } from "./products.entity";
import { CreateProductDto } from "./dto/create-product.dto";
//GUARDS & DECORATORS
import { CurrentUser } from "@decorators/current-user.decorator";
import { Roles } from "@decorators/roles.decorator";
@ApiTags("products")
@ApiBearerAuth("JWT-auth") // ✅ Agregar autenticación JWT a todo el controlador
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
    //Create a new product - Solo Admin y Manager pueden crear productos
    @Post()
    @ApiOperation({ summary: "Crear un nuevo producto" })
    @ApiResponse({ status: 201, description: "El producto ha sido creado.", type: Product })
    @ApiResponse({ status: 400, description: "Solicitud inválida." })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @ApiResponse({ status: 403, description: "Acceso prohibido." })
    @ApiResponse({ status: 500, description: "Error interno del servidor." })
    async createProduct(
        @Body() dto: CreateProductDto,
        @CurrentUser() user: any
    ): Promise<Product> {
        console.log(`Producto creado por: ${user.username}`);
        return this.productsService.createProduct(dto);
    }
    //Get all products - Cualquier usuario autenticado puede ver los productos
    @Get()
    @ApiOperation({ summary: "Obtener todos los productos" })
    @ApiResponse({ status: 200, description: "Lista de productos obtenida.", type: [Product] })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @ApiResponse({ status: 403, description: "Acceso prohibido." })
    @ApiResponse({ status: 500, description: "Error interno del servidor." })
    async getAllProducts(@CurrentUser() user: any): Promise<Product[]> {
        console.log(`Lista de productos solicitada por: ${user.username}`);
        return this.productsService.getAllProducts();
    }
    //Delete a product - Solo Admin y Manager pueden eliminar productos 
    @Delete(":id")
    @ApiOperation({ summary: "Eliminar un producto" })
    @ApiResponse({ status: 200, description: "El producto ha sido eliminado." })
    @ApiResponse({ status: 400, description: "Solicitud inválida." })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @ApiResponse({ status: 403, description: "Acceso prohibido." })
    @ApiResponse({ status: 500, description: "Error interno del servidor." })
    async deleteProduct(
        @Body("id") id: number,
        @CurrentUser() user: any
    ): Promise<void> {
        console.log(`Producto eliminado por: ${user.username}`);
        return this.productsService.deleteProduct(id);
    }
}   