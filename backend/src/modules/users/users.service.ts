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
            return this.usersRepository.findOne({ where: { email } });
        }

        async FindAll(): Promise<User[]> {
            return this.usersRepository.find();
        }

        async FindById(id: number): Promise<User | null> {
            return this.usersRepository.findOne({ where: { id } });
        }


}
