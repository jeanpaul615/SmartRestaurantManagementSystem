import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { setupSwagger } from '@config/Swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

// ✅ Manejo de errores no capturados
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
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

    // 🍪 Habilitar cookie-parser
    app.use(cookieParser());

    // ✅ Configuración de CORS
    app.enableCors({
      origin: [
        'http://localhost:3000', // Frontend local
        'http://localhost:3001', // Frontend alternativo
        process.env.FRONTEND_URL || '', // Frontend en producción
      ].filter(Boolean), // Elimina valores vacíos
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true, // Permite envío de cookies
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // ✅ Filtro global de excepciones
    app.useGlobalFilters(new AllExceptionsFilter());

    // ✅ Validación global de DTOs
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    Logger.overrideLogger(['error', 'warn', 'log']);

    // ✅ Swagger
    setupSwagger(app);

    const port = process.env.PORT ?? 8000;
    const server = await app.listen(port);

    Logger.log(`🚀 Servidor corriendo en puerto ${port}`, 'Bootstrap');

    // 🧹 Manejo elegante del cierre de la app
    const shutdown = async (signal: string) => {
      Logger.warn(`\n📴 Señal recibida (${signal}). Cerrando servidor...`, 'Shutdown');
      try {
        await server.close();
        Logger.log('✅ Servidor cerrado correctamente.', 'Shutdown');
        process.exit(0);
      } catch (err) {
        Logger.error('❌ Error al cerrar el servidor:', err);
        process.exit(1);
      }
    };

    // Captura de señales comunes
    process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl + C
    process.on('SIGTERM', () => shutdown('SIGTERM')); // Docker / PM2 / sistemas
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

bootstrap();
