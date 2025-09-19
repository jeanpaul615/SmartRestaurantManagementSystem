import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Reservation } from '../reservations/reservations.entity';
import { Order } from '../orders/orders.entity'; 
import { Restaurant } from '../restaurant/restaurant.entity';   

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

@ManyToOne(() => Restaurant, restaurant => restaurant.tables)
restaurant: Restaurant;

@OneToMany(() => Reservation, reservation => reservation.tables)
reservations: Reservation[];

@OneToMany(() => Order, order => order.tables)
orders: Order[];
}
