
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/Swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //Swagger Integration
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
  