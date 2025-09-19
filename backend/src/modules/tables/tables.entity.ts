import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../reservations/reservations.entity';
import { Order } from '../orders/orders.entity';    

@Entity('tables')
export class Tables {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    number: number;

    @Column()
    capacity: number;

    @Column({length: 20, default: 'available'})
    status: string;

    @OneToMany(() => Reservation, reservation => reservation.tables)
    reservations: Reservation[];

    @OneToMany(() => Order, order => order.table)
    orders: Order[];
}
