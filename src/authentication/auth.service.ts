import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SendMailInfo } from './interfaces/send-mail-info.interface';

import { RequestRegisterUserDto } from './dto/request-register-user.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginUserDto } from './dto/login-user.dto';



const global_url="http://localhost:3000/";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) //Para incorporar nuestra entidad que está en otro módulo
        private readonly userRepository: Repository<User>,    
        private readonly jwtService: JwtService, //Viene o hace parte del JwtModule, lo necesitamos para generar el jwt
        private readonly mailerService: MailerService,
    ){}

    async requestRegisterUser(requestRegisterUserDto: RequestRegisterUserDto) {

      const { password, ...userData } = requestRegisterUserDto;

      const user = await this.findOneByEmail( userData.email );
      if ( user ) return {
        message: 'Usuario ya registrado.',
      };

      const passEncrypted = bcrypt.hashSync(password, 10);

    

      try {

        this.sendMail({
          to: userData.email,
          from: process.env.MAIL_USER,
          subject: 'Confirm your email',
          html: `<!DOCTYPE html>
          <html lang="es">
          
          <head>
          <style>
          .plan {
            border-radius: 16px;
            box-shadow: 0 30px 30px -25px rgba(0, 38, 255, 0.205);
            padding: 10px;
            background-color: #fff;
            color: #697e91;
            max-width: 500px;
            text-align: center;
          }
          
          .plan strong {
            font-weight: 600;
            color: #425275;
          }
          
          .plan .inner {
            align-items: center;
            padding: 20px;
            padding-top: 40px;
            background-color: #ecf0ff;
            border-radius: 12px;
            position: relative;
          }
          
          .plan .pricing {
            position: absolute;
            top: 0;
            right: 0;
            background-color: #bed6fb;
            border-radius: 99em 0 0 99em;
            display: flex;
            align-items: center;
            padding: 0.625em 0.75em;
            font-size: 1.25rem;
            font-weight: 600;
            color: #425475;
          }
          
          .plan .pricing small {
            color: #707a91;
            font-size: 0.75em;
            margin-left: 0.25em;
          }
          
          .plan .title {
            font-weight: 600;
            font-size: 1.25rem;
            color: #425675;
            text-align:center;
          }
          
          .plan .title + * {
            margin-top: 0.75rem;
          }
          
          .plan .info + * {
            margin-top: 1rem;
          }
          
          .plan .features {
            display: flex;
            flex-direction: column;
          }
          
          .plan .features li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .plan .features li + * {
            margin-top: 0.75rem;
          }
          
          .plan .features .icon {
            background-color: #1FCAC5;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            border-radius: 50%;
            width: 20px;
            height: 20px;
          }
          
          .plan .features .icon svg {
            width: 14px;
            height: 14px;
          }
          
          .plan .features + * {
            margin-top: 1.25rem;
          }
          
          .plan .action {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: end;
          }
          
          .plan .button {
            background-color: #6558d3;
            border-radius: 6px;
            color: #fff;
            font-weight: 500;
            font-size: 1.125rem;
            text-align: center;
            border: 0;
            outline: 0;
            width: 100%;
            padding: 0.625em 0.75em;
            text-decoration: none;
          }
          
          .plan .button:hover, .plan .button:focus {
            background-color: #4133B7;
          }
          
          </style>
            
          </head>
          
          <body>
          <div class="plan">
<div class="inner">
<img src="cid:img4"  width="400" height="300"/>
<br>

</div>
		<div class="inner">
			<p class="title">Confirme su cuenta</p>
			<p class="info">Gracias por elegir PassLocker.</p>
			<p class="info">Para confirmar su cuenta debe pulsar sobre el botón y empezará a disfrutar de su servicio.</p>
			
			<div class="action">
			<a class="button" href="${global_url}rutaAngular?email=${userData.email}&password=${passEncrypted}&fullName=${userData.fullName}&userType={${userData.userType}}"">
				¡ACTIVAR CUENTA!
			</a>
			</div>
      <br>
      <a href="url">Activar cuenta</a>
		</div>
	</div>
        
          </body>
          
          </html>`,
          
          
        });
          
        return {
          message: 'Correo enviado correctamente.',
        };
       
      
      } catch (error) {
        this.handleDBErrors(error);
      }
    }

    async login(loginUserDto: LoginUserDto): Promise<{accessToken: string}> {

      const { password, email } = loginUserDto;
      const user = await this.findOneByEmail(email);

      if ( !user )
        throw new UnprocessableEntityException('This action can not be done');  
      if ( bcrypt.compareSync( password, user.password) )

      return {
        accessToken: this.getJwtToken( {  
          email: user.email,
          fullName: user.fullName,
          userType: user.userType,
          password: user.password } )
      };
      
      throw new UnauthorizedException('Credentials are not valid');

    }

    async loginRequest(loginRequestDto: LoginRequestDto) {

        const {email,code } = loginRequestDto;
        const user = await this.findOneByEmail(email);
  
      if (!user)
        throw new NotFoundException('User does not exist!');

      try {

        this.sendMail({
          to: user.email,
          from: 'info@passLocker.com',
          subject: 'Verification Code',
          html: `<!DOCTYPE html>
          <html>
          <head>
          <style>
          .plan {
            border-radius: 16px;
            box-shadow: 0 30px 30px -25px rgba(0, 38, 255, 0.205);
            padding: 10px;
            background-color: #fff;
            color: #697e91;
            max-width: 300px;
          }
          
          .plan strong {
            font-weight: 600;
            color: #425275;
          }
          
          .plan .inner {
            align-items: center;
            padding: 20px;
            padding-top: 40px;
            background-color: #ecf0ff;
            border-radius: 12px;
            position: relative;
          }
          
          .plan .pricing {
            position: absolute;
            top: 0;
            right: 0;
            background-color: #bed6fb;
            border-radius: 99em 0 0 99em;
            display: flex;
            align-items: center;
            padding: 0.625em 0.75em;
            font-size: 1.25rem;
            font-weight: 600;
            color: #425475;
          }
          
          .plan .pricing small {
            color: #707a91;
            font-size: 0.75em;
            margin-left: 0.25em;
          }
          
          .plan .title {
            font-weight: 600;
            font-size: 1.25rem;
            color: #425675;
          }
          
          .plan .title + * {
            margin-top: 0.75rem;
          }
          
          .plan .info + * {
            margin-top: 1rem;
          }
          
          .plan .features {
            display: flex;
            flex-direction: column;
          }
          
          .plan .features li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .plan .features li + * {
            margin-top: 0.75rem;
          }
          
          .plan .features .icon {
            background-color: #1FCAC5;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            border-radius: 50%;
            width: 20px;
            height: 20px;
          }
          
          .plan .features .icon svg {
            width: 14px;
            height: 14px;
          }
          
          .plan .features + * {
            margin-top: 1.25rem;
          }
          
          .plan .action {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: end;
          }
          
          .plan .button {
            background-color: #6558d3;
            border-radius: 6px;
            color: #fff;
            font-weight: 500;
            font-size: 1.125rem;
            text-align: center;
            border: 0;
            outline: 0;
            width: 100%;
            padding: 0.625em 0.75em;
            text-decoration: none;
          }
          
          .plan .button:hover, .plan .button:focus {
            background-color: #4133B7;
          }
          </style>
          </head>
          <body>
          <div class="plan">
          <div class="inner">
            <span class="pricing">
              
            </span>
            <p class="title">Verification code:</p>
            <p class="title"> ${code}</p>
            <p class="info">Insert this validation code to confirm.</p>
            <p class="info">Thanks for using PassLoker.</p>
            
            
          </div>
          </div>
                  </body>
                  <footer class="footer py-4">
                    <div class="container">
                        
                            <div class="col-lg-3 text-lg-start">Copyright &copy; PassLocker 2024</div>
                        
                    </div>
                </footer>
                  </html>`,
        });
            
        return {
          message: 'Correo enviado correctamente.',
        };

      } catch (error) {
        this.handleDBErrors(error);
      }
    }
    

    async registerUser(requestRegisterUserDto: RequestRegisterUserDto) {
      
      try {

        const { email, fullName, userType, password } = requestRegisterUserDto;
          
        //Registra usuario en BBDD
        const user = this.userRepository.create({ email, fullName, userType, password });
        await this.userRepository.save(user);
        delete user.password;
        return {
          //token,
          message: 'Usuario registrado correctamente.',

        };
      } catch (error) {
        this.handleDBErrors(error);
      }
    }

    async requestResetPassword( requestResetPasswordDto: RequestResetPasswordDto ) {

      const { email } = requestResetPasswordDto;
      const user = await this.findOneByEmail(email);
      if (!user)
        throw new UnprocessableEntityException('This action can not be done');
      
      user.resetPasswordToken = v4();
      
      try {
      
        this.userRepository.save(user); 

        //Prepara envío de correo
        this.sendMail({
          to: email,
          from: 'info@passLocker.com',
          subject: 'Reset your email',
          html: `<!DOCTYPE html>
          <html lang="es">
          
          <head>
          <style>
          .plan {
            border-radius: 16px;
            box-shadow: 0 30px 30px -25px rgba(0, 38, 255, 0.205);
            padding: 10px;
            background-color: #fff;
            color: #697e91;
            max-width: 500px;
            text-align: center;
          }
          
          .plan strong {
            font-weight: 600;
            color: #425275;
          }
          
          .plan .inner {
            align-items: center;
            padding: 20px;
            padding-top: 40px;
            background-color: #ecf0ff;
            border-radius: 12px;
            position: relative;
          }
          
          .plan .pricing {
            position: absolute;
            top: 0;
            right: 0;
            background-color: #bed6fb;
            border-radius: 99em 0 0 99em;
            display: flex;
            align-items: center;
            padding: 0.625em 0.75em;
            font-size: 1.25rem;
            font-weight: 600;
            color: #425475;
          }
          
          .plan .pricing small {
            color: #707a91;
            font-size: 0.75em;
            margin-left: 0.25em;
          }
          
          .plan .title {
            font-weight: 600;
            font-size: 1.25rem;
            color: #425675;
            text-align:center;
          }
          
          .plan .title + * {
            margin-top: 0.75rem;
          }
          
          .plan .info + * {
            margin-top: 1rem;
          }
          
          .plan .features {
            display: flex;
            flex-direction: column;
          }
          
          .plan .features li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .plan .features li + * {
            margin-top: 0.75rem;
          }
          
          .plan .features .icon {
            background-color: #1FCAC5;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            border-radius: 50%;
            width: 20px;
            height: 20px;
          }
          
          .plan .features .icon svg {
            width: 14px;
            height: 14px;
          }
          
          .plan .features + * {
            margin-top: 1.25rem;
          }
          
          .plan .action {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: end;
          }
          
          .plan .button {
            background-color: #6558d3;
            border-radius: 6px;
            color: #fff;
            font-weight: 500;
            font-size: 1.125rem;
            text-align: center;
            border: 0;
            outline: 0;
            width: 100%;
            padding: 0.625em 0.75em;
            text-decoration: none;
          }
          
          .plan .button:hover, .plan .button:focus {
            background-color: #4133B7;
          }
          
          </style>
            
          </head>
          
          <body>
          <div class="plan">
<div class="inner">
<img src="cid:img3"  width="400" height="300"/>
<br>

</div>
		<div class="inner">
			<p class="title">Reset Password</p>
			<p class="info">Gracias por elegir PassLocker.</p>
			<p class="info">Para restablecer su contraseña con la nueva indicada pulse en el botón o enlace.</p>
			
			<div class="action">
			<a class="button" href="#">
				¡RESTABLECER CONTRASEÑA!
			</a>
			</div>
      <br>
      <a href="url">Restablecer contraseña</a>
		</div>
	</div>
        
          </body>
          
          </html>`,
        });

        return {
          message: 'Correo enviado correctamente.',
        };

      } catch (error) {
        this.handleDBErrors(error);
      }
      
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
      
      const { resetPasswordToken, password } = resetPasswordDto;
     
      const user = await this.userRepository.findOne({ 
        where: { resetPasswordToken },
        select: { email: true, password: true, id: true }, 
      });

      if (!user)
        throw new UnprocessableEntityException('This action can not be done');
  
      user.password = bcrypt.hashSync( password, 10);
      user.resetPasswordToken = null;
      this.userRepository.save(user);
      return {
        message: 'Cuenta reestablecida con éxito.',
      };
    }
  

    private getJwtToken( payload: JwtPayload ){

      //Vamos a generar el token con el payload
      //el jwtService hace parte del JwtModule (que ya tiene configurado el secreto y el tiempo de expiración)
      const token = this.jwtService.sign( payload );
      return token;
  
    }

    private handleDBErrors(error:any): never {

      if( error.code === '23505')
        throw new BadRequestException(error.detail);

      if( error.code === 'EAUTH')
        throw new ConflictException('Mail service error, email not sent');        
      
      throw new InternalServerErrorException('Please check server logs');
    
    }

    private async findOneByEmail(email){
      const user = await this.userRepository.findOne({ 
        where: { email },
        select: { email: true, password: true, id: true }, //sólo selecciona estos atributos
      });

      return user;
    };

    private async sendMail( mailInfo: SendMailInfo ){

      const emailData = { ...mailInfo,attachments: [{
        filename: 'img4.png',
        path: 'C:/wamp64/www/passlockergit/PassLocker-Back/src/assets/img4.png',
        cid: 'img4'
    },
    {
      filename: 'img3.png',
      path: 'C:/wamp64/www/passlockergit/PassLocker-Back/src/assets/img3.png',
      cid: 'img3'
    }] };
      await this.mailerService.sendMail( emailData );
      

    }
 
}
