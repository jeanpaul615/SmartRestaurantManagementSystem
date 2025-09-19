import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./users.entity";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

        async CreateUser(createUserDto: CreateUserDto): Promise<User> {
            // Transform role to the correct type if necessary
            const { role, ...rest } = createUserDto;
            const newUser = this.usersRepository.create({
                ...rest,
                role: role as any // Replace 'any' with the actual UserRole type if available
            });
            return this.usersRepository.save(newUser);
        }

        async FindByEmail(email: string): Promise<User | null> {
            return this.usersRepository.findOne({
                where: { email },
                cache: {
                    id: `user-by-email-${email}`,
                    milliseconds: 60000, // cache por 60 segundos
                },
            });
        }

        async FindAll(): Promise<User[]> {
            return this.usersRepository.find({
                select: ['id', 'username', 'email', 'role'],
                take: 100,
                cache: {
                    id: 'users-list',
                    milliseconds: 60000, // cache por 60 segundos
                },
            });
        }

        async FindById(id: number): Promise<User | null> {
            return this.usersRepository.findOne({
                where: { id },
                cache: {
                    id: `user-by-id-${id}`,
                    milliseconds: 60000, // cache por 60 segundos
                },
            });
        }


}
