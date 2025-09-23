import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tables } from "./tables.entity";
import { CreateTableDto } from "./dto/create-tables.dto";

@Injectable()
export class TablesService {
    constructor(
        @InjectRepository(Tables)
        private tablesRepository: Repository<Tables>,
    ) {}


    async CreateTable(CreateTableDto: CreateTableDto): Promise<Tables> {
        const newTable = this.tablesRepository.create({...CreateTableDto});
        return this.tablesRepository.save(newTable);
}

    async FindAll(): Promise<Tables[]> {
        return this.tablesRepository.find({
            take: 100,
            cache: {
                id: 'tables-list',
                milliseconds: 60000, // cache por 60 segundos
            },
        });
    }

}