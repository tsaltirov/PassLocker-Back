import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    //Para reflejarlo como tabla en la BBDD
    TypeOrmModule.forFeature([ User ]), //Lleva el nombre de la entidad que vamos a estar manejando en este módulo
    PassportModule.register({ //Indico modo de autenticación que quiero, es decir, cómo evaluar el método de acceso: JWT
      defaultStrategy: 'jwt',
    }),
    //Para un registro asíncrono, para asegurarme de que el módulo se monte cuando ya tenga definido el JWT_SECRET (o incluso, el resto de los valores de las variables de entorno)
    JwtModule.registerAsync({
      imports: [ ConfigModule ], //Importo esto que luego...
      inject: [ ConfigService ], //...me va a permitir injectar mi ConfigService
      useFactory: ( configService: ConfigService ) => { //es la función que se va a llamar cuando se intente registrar de manera asíncrona el módulo
        
        //console.log('JWT Secret ', configService.get('JWT_SECRET'));
        //console.log('JWT SECRET ', process.env.JWT_SECRET);
        
        return{
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          }
        }
      }}),
      //Configuración de nodemailer. Configuración SMTP del correo que vamos a utilizar.
      MailerModule.forRootAsync({
        useFactory: () => ({
          transport: {
            host: 'smtp.hostinger.com',
            pool:true,
            port: 587,
            secure: false, 
            ignoreTLS:true,
            auth: {
              user: process.env.USER_MAIL,
              pass: process.env.PASSWORD_MAIL,
            },
            tls: {
              
          }
          },
          defaults: {
            from:'"nest-modules" <modules@nestjs.com>',
          },
          template: {
            dir: process.cwd() + '/templates/',
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        }),
      })
  ],
  exports: [
    TypeOrmModule, //en el caso que de quiera trabajar en otro módulo con la entidad User
    JwtStrategy,
    PassportModule,
    JwtModule
  ],
})
export class AuthModule {}
