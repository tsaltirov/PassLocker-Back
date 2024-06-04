import { Module } from '@nestjs/common';
import { AuthModule } from './authentication/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordModuleModule } from './pass-handler/pass-handler.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
        //Configuración para realizar una conección certificada (ssl + extra), para cuando vayamos a desplegar y no nos de error.
        //ssl va a obtener un valor booleano, dependiendo si se trata de PROD o no
        ssl: process.env.STAGE === 'prod',
        extra: {
          ssl: process.env.STAGE === 'prod'
          ? { rejectUnauthorized: false }
          : null,
        },
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        autoLoadEntities: true,
        synchronize: true,
      }),

    AuthModule,

    PasswordModuleModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
