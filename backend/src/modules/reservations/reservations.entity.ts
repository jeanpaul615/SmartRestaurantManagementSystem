import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { User } from '../users/users.entity';
import { Table } from '../tables/tables.entity';    

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

    @ManyToOne(() => Table, table => table.reservations, {eager: true})
    table: Table; 
}