import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const config = new DocumentBuilder()
  .setTitle('PassLocker RESTFul API')
  .setDescription('PassLocker endpoints')
  .setVersion('1.0')
  //.addTag('cats') //Es un agrupador
  .build();
  const document = SwaggerModule.createDocument(app, config); //puedo cambiar, tema, colores, etc
  SwaggerModule.setup('api', app, document); // se crea en el endpoint api, va a envial la app y nuestro docto

  await app.listen(3000);
}
bootstrap();
