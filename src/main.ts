import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //const logger = new Logger('Bootstrap')

  app.setGlobalPrefix('api');

  //Para la configuración global de pipes 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
    })
  );








  await app.listen(3000);
}
bootstrap();
