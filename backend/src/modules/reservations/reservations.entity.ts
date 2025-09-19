import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { User } from '../users/users.entity';
import { Tables } from '../tables/tables.entity';    
import { Restaurant } from '../restaurant/restaurant.entity';

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'timestamp'})
    reservationTime: Date;  

    @Column({ length: 20, default: 'pending'})
    status: string;

    @ManyToOne(() => Restaurant, restaurant => restaurant.reservations)
    restaurant: Restaurant;

    @ManyToOne(() => User, user => user.reservations)
    user: User;

    @ManyToOne(() => Tables, table => table.reservations)
    tables: Tables;
}