import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Verificar si el email ya existe
        const existingUser = await this.FindByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const { role, ...rest } = createUserDto;
        const newUser = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
            role: role as any 
        });

        return await this.usersRepository.save(newUser);
    }

    async findAll(role?: UserRole, status?: UserStatus): Promise<User[]> {
        const queryBuilder = this.usersRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.username', 'user.email', 'user.role', 'user.status', 'user.createdAt', 'user.updatedAt']);

        if (role) {
            queryBuilder.andWhere('user.role = :role', { role });
        }

        if (status) {
            queryBuilder.andWhere('user.status = :status', { status });
        }

        queryBuilder.orderBy('user.createdAt', 'DESC');

        return await queryBuilder.getMany();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: ['id', 'username', 'email', 'role', 'status', 'createdAt', 'updatedAt'],
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
        });
    }

    async findByRole(role: UserRole): Promise<User[]> {
        return this.findAll(role);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        // Si se actualiza el email, verificar que no exista
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.FindByEmail(updateUserDto.email);
            if (existingUser) {
                throw new ConflictException('El email ya está registrado');
            }
        }

        // Si se actualiza la contraseña, hashearla
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);

        return await this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }

    async deactivate(id: number): Promise<User> {
        return this.update(id, { status: UserStatus.INACTIVE });
    }

    async activate(id: number): Promise<User> {
        return this.update(id, { status: UserStatus.ACTIVE });
    }

    async changeRole(id: number, role: UserRole): Promise<User> {
        return this.update(id, { role });
    }

    // Métodos legacy para compatibilidad
    async CreateUser(createUserDto: CreateUserDto): Promise<User> {
        return this.create(createUserDto);
    }

    async FindByEmail(email: string): Promise<User | null> {
        return this.findByEmail(email);
    }

    async FindAll(): Promise<User[]> {
        return this.findAll();
    }

    async FindById(id: number): Promise<User | null> {
        try {
            return await this.findOne(id);
        } catch {
            return null;
        }
    }
}
