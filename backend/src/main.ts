import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { setupSwagger } from '@config/Swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

// ✅ Manejo de errores no capturados
process.on('uncaughtException', (error: Error) => {
  console.error('💥 Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('💥 Unhandled Rejection at:', promise);
  console.error('Reason:', reason instanceof Error ? reason.message : String(reason));
  process.exit(1);
});

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
      logger: ['error', 'warn'], // Solo mostrar errores y advertencias
    });

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

    // ✅ Swagger
    setupSwagger(app);

    const port = process.env.PORT ?? 8000;
    await app.listen(port);

    console.log(`\n🚀 Servidor corriendo en http://localhost:${port}`);
    console.log(`📚 Swagger disponible en http://localhost:${port}/api\n`);

    // 🧹 Manejo elegante del cierre de la app
    const shutdown = (signal: string) => {
      console.log(`\n📴 Cerrando servidor (${signal})...`);

      app
        .close()
        .then(() => {
          console.log('✅ Servidor cerrado correctamente.');
          process.exit(0);
        })
        .catch((err) => {
          console.error(
            '❌ Error al cerrar el servidor:',
            err instanceof Error ? err.message : String(err),
          );
          process.exit(1);
        });
    };

    // Captura de señales comunes
    process.on('SIGINT', () => {
      shutdown('SIGINT');
    }); // Ctrl + C
    process.on('SIGTERM', () => {
      shutdown('SIGTERM');
    }); // Docker / PM2 / sistemas
  } catch (error) {
    console.error(
      '❌ Error al iniciar el servidor:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

// ✅ Llamada correcta a bootstrap con manejo de errores
void bootstrap();
