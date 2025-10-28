"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const Swagger_1 = require("./config/Swagger");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
    process.exit(1);
});
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
        app.useGlobalPipes(new common_2.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        common_1.Logger.overrideLogger(['error', 'warn', 'log']);
        (0, Swagger_1.setupSwagger)(app);
        const port = process.env.PORT ?? 8000;
        await app.listen(port);
        common_1.Logger.log(`🚀 Servidor corriendo en puerto ${port}`, 'Bootstrap');
    }
    catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map