"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = void 0;
const typeorm_1 = require("@nestjs/typeorm");
exports.DatabaseConfig = typeorm_1.TypeOrmModule.forRoot({
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
//# sourceMappingURL=Database.js.map