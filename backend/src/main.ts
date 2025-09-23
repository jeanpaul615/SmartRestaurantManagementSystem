
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { setupSwagger } from '@config/Swagger';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  Logger.overrideLogger(['error']); // Solo muestra errores
  //Swagger Integration
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
  