"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../modules/users/users.entity");
const reservations_entity_1 = require("../modules/reservations/reservations.entity");
const tables_entity_1 = require("../modules/tables/tables.entity");
const notifications_entity_1 = require("../modules/notifications/notifications.entity");
const orders_entity_1 = require("../modules/orders/orders.entity");
const order_items_entity_1 = require("../modules/order_items/order_items.entity");
const products_entity_1 = require("../modules/products/products.entity");
const restaurant_entity_1 = require("../modules/restaurant/restaurant.entity");
exports.DatabaseConfig = typeorm_1.TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test',
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    entities: [users_entity_1.User, reservations_entity_1.Reservation, tables_entity_1.Tables, notifications_entity_1.Notification, orders_entity_1.Order, order_items_entity_1.OrderItem, products_entity_1.Product, restaurant_entity_1.Restaurant],
});
//# sourceMappingURL=Database.js.map