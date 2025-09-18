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
            const newUser = this.usersRepository.create(createUserDto);
            return this.usersRepository.save(newUser);
        }

        async FindByEmail(email: string): Promise<User | null> {
            return this.usersRepository.findOne({ where: { email } });
        }

        async FindById(id: number): Promise<User | null> {
            return this.usersRepository.findOne({ where: { id } });
        }


}
