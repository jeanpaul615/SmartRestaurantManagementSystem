import { Controller, Get, Post, Put, Delete, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ReservationService } from "./reservations.service";
import { Reservation } from "./reservations.entity";

//DTOs
import { CreateReservationDto } from "./dto/create-reservation.dto";
//GUARDS & DECORATORS
import { CurrentUser } from "@decorators/current-user.decorator";
import { Roles } from "@decorators/roles.decorator";

@ApiTags("reservations")
@ApiBearerAuth("JWT-auth") // ✅ Agregar autenticación JWT a todo el controlador
@Controller("reservations")
export class ReservationsController {
    constructor(private readonly reservationService: ReservationService) {}
    //Create a new reservation - Cualquier usuario autenticado puede crear reservas
    @Post()
    @ApiOperation({ summary: "Crear una nueva reserva" })
    @ApiResponse({ status: 201, description: "La reserva ha sido creada.", type: Reservation })
    @ApiResponse({ status: 400, description: "Solicitud inválida." })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @ApiResponse({ status: 500, description: "Error interno del servidor." })
    async createReservation(
        @Body() dto: CreateReservationDto,
        @CurrentUser() user: any
    ): Promise<Reservation> {
        console.log(`Reserva creada por: ${user.username}`);
        return this.reservationService.CreateReservation(dto);
    }
    //Get all reservations - Cualquier usuario autenticado puede ver las reservas
    @Get()
    @ApiOperation({ summary: "Obtener todas las reservas" })
    @ApiResponse({ status: 200, description: "Lista de reservas obtenida.", type: [Reservation] })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @ApiResponse({ status: 500, description: "Error interno del servidor." })
    async getAllReservations(@CurrentUser() user: any): Promise<Reservation[]> {
        console.log(`Lista de reservas solicitada por: ${user.username}`);
        return this.reservationService.FindAll();
    }
}