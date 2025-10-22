
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { setupSwagger } from '@config/Swagger';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';

// ✅ Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // En producción, loguear a servicio externo (Sentry, CloudWatch)
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // En producción, loguear a servicio externo
  process.exit(1);
});

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // ✅ Filtro global de excepciones
    app.useGlobalFilters(new AllExceptionsFilter());
    
    // ✅ Validación global de DTOs
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // Remueve propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extras
      transform: true, // Transforma tipos automáticamente
    }));
    
    Logger.overrideLogger(['error', 'warn', 'log']); // Logs en producción
    
    //Swagger Integration
    setupSwagger(app);

    const port = process.env.PORT ?? 8000;
    await app.listen(port);
    
    Logger.log(`🚀 Servidor corriendo en puerto ${port}`, 'Bootstrap');
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

bootstrap();
  