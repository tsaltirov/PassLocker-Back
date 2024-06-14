import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassHandler } from './entities/pass-handler.entity';
import { PassHandlerController } from './pass-handler.controller';
import { PassHandlerService } from './pass-handler.service';
import { AuthModule } from 'src/authentication/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PassHandlerController],
  providers: [PassHandlerService],
  imports: [
    //Para reflejarlo como tabla en la BBDD
    TypeOrmModule.forFeature([ PassHandler ]), //Lleva el nombre de la entidad
    AuthModule,
    
  ],
  exports: [
    PassHandlerService,
    TypeOrmModule //en el caso que de quiera trabajar en otro módulo con la entidad Password
  ],
})
export class PasswordModuleModule {}
