import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Reservation } from '../reservations/reservations.entity';
import { Order } from '../orders/orders.entity';
import { Notification } from '../notifications/notifications.entity';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50})
    username:string;

    @Column({ length: 100, unique: true})
    email:string;

    @Column({ length: 100})
    password:string;

    @Column({ length: 50})
    role:string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @OneToMany(() => Reservation, reservation => reservation.user)
    reservations: Reservation[];

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];

}