import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservations.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { Tables } from '../tables/tables.entity';
import { User } from '../users/users.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Tables)
    private readonly tablesRepository: Repository<Tables>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: number): Promise<Reservation> {
    const { restaurantId, tableId, reservationDate, numberOfGuests, notes, status } =
      createReservationDto;

    // Verificar que el restaurante existe
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurante con ID ${restaurantId} no encontrado`);
    }

    // Verificar que la mesa existe
    const table = await this.tablesRepository.findOne({
      where: { id: tableId },
    });
    if (!table) {
      throw new NotFoundException(`Mesa con ID ${tableId} no encontrada`);
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Verificar que la fecha de reservación no sea en el pasado
    const reservationDateTime = new Date(reservationDate);
    if (reservationDateTime < new Date()) {
      throw new BadRequestException('La fecha de reservación no puede ser en el pasado');
    }

    const reservation = this.reservationRepository.create({
      reservationDate: reservationDateTime,
      numberOfGuests,
      notes,
      status: status || 'pending',
      restaurant,
      tables: table,
      user,
    });

    return await this.reservationRepository.save(reservation);
  }

  async findAll(userId?: number, restaurantId?: number): Promise<Reservation[]> {
    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.restaurant', 'restaurant')
      .leftJoinAndSelect('reservation.tables', 'tables');

    if (userId) {
      queryBuilder.andWhere('reservation.user.id = :userId', { userId });
    }

    if (restaurantId) {
      queryBuilder.andWhere('reservation.restaurant.id = :restaurantId', { restaurantId });
    }

    queryBuilder.orderBy('reservation.reservationDate', 'ASC');

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant', 'tables'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservación con ID ${id} no encontrada`);
    }

    return reservation;
  }

  async findByUser(userId: number): Promise<Reservation[]> {
    return this.findAll(userId);
  }

  async findByRestaurant(restaurantId: number): Promise<Reservation[]> {
    return this.findAll(undefined, restaurantId);
  }

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (updateReservationDto.reservationDate) {
      const newDate = new Date(updateReservationDto.reservationDate);
      if (newDate < new Date()) {
        throw new BadRequestException('La fecha de reservación no puede ser en el pasado');
      }
      reservation.reservationDate = newDate;
    }

    if (updateReservationDto.numberOfGuests) {
      reservation.numberOfGuests = updateReservationDto.numberOfGuests;
    }

    if (updateReservationDto.notes !== undefined) {
      reservation.notes = updateReservationDto.notes;
    }

    if (updateReservationDto.status) {
      reservation.status = updateReservationDto.status;
    }

    return await this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }

  async cancelReservation(id: number): Promise<Reservation> {
    return this.update(id, { status: 'cancelled' });
  }

  async confirmReservation(id: number): Promise<Reservation> {
    return this.update(id, { status: 'confirmed' });
  }
}
