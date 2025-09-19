import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { User } from '../users/users.entity';
import { Tables } from '../tables/tables.entity';    

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'timestamp'})
    reservationTime: Date;  

    @Column({ length: 20, default: 'pending'})
    status: string;

    @ManyToOne(() => User, user => user.reservations, {eager: true})
    user: User;

    @ManyToOne(() => Tables, tables => tables.reservations, {eager: true})
    tables: Tables; 
}