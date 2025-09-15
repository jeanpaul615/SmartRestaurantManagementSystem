import { TypeOrmModule } from "@nestjs/typeorm";


export const DatabaseConfig = TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test',
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
});