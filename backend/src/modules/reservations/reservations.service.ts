import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Reservation } from "./reservations.entity";
import { CreateReservationDto } from "./dto/create-reservation.dto";

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
    ) {}


    async CreateReservation(dto: CreateReservationDto): Promise<Reservation> {
        const newReservation = this.reservationRepository.create(dto);
        return this.reservationRepository.save(newReservation);
    }

    async FindAll(): Promise<Reservation[]> {
        return this.reservationRepository.find({
            take: 100,
            cache: {
                id: 'reservations-list',
                milliseconds: 60000, // cache por 60 segundos
            },
        });
    }
}