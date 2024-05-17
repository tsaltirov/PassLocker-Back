import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { ForgetUserDto } from './dto/forget-user.dto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
const global_url="http://localhost:3000/";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) //Para incorporar nuestra entidad que está en otro módulo
        private readonly userRepository: Repository<User>, private readonly mailerService: MailerService,
    
        private readonly jwtService: JwtService, //Viene o hace parte del JwtModule, lo necesitamos para generar el jwt
        ){}

    async create(createUserDto: CreateUserDto) {

        try {
    
          const { password, ...userData } = createUserDto;
          
          const user = this.userRepository.create({
            ...userData,
            password: bcrypt.hashSync( password, 10)
          });
    
          await this.userRepository.save(user);
          delete user.password;
    
          return {
            ...user,
            //token: this.getJwtToken( { id: user.id} )
          };
          
        } catch (error) {
          this.handleDBErrors(error);
          
        }
    
      }

      //Función recibe datos del registro para ser enviados al correo y montados como url de confirmación.
  async registermail(createUserDto: CreateUserDto) {

    try {

      const { password, email,fullName,userType } = createUserDto;
      const passencrypted = bcrypt.hashSync( password, 10);
      

      this
        .mailerService
        .sendMail({
          to: `${email}`, // list of receivers
          from: `${process.env.USER_MAIL}`, // sender address
          subject: 'Confirm your email ', // Subject line
          //text: 'welcome', // plaintext body
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
			<p class="title">Confirma tu correo electrónico.</p>
			<p class="info">Gracias por elegir PassLocker para la gestión de tus contraseñas. </p>
      <p class="info">Para acceder y disfrutar del servicio pulse el link o botón mas abajo para confirmar tu cuenta.</p>
			
			<div class="action">
			<a class="button" href="${global_url}rutaAngular?email=${email}&password=${passencrypted}&fullName=${fullName}&roles={${userType}}">
				Confirmar mi cuenta
			</a>
			</div>
		</div>
	</div>
          </body>
          <footer class="footer py-4">
             <div class="container">
                 
                     <div class="col-lg-3 text-lg-start">Copyright &copy; PassLocker 2024</div>
                 
             </div>
         </footer>
          </html>`, // HTML body content
        })
        .then((success) => {
          console.log(success)
        })
        .catch((err) => {
          console.log(err)
        });

      return {
        message: 'Correo enviado correctamente.'
        //token: this.getJwtToken( { email: user.email} )
        //token: this.getJwtToken( { id: user.id} )
      };

    } catch (error) {
      this.handleDBErrors(error);

    }

  }

  //Función envío correo de olvido de contraseña y login del doble FA.

  async twofa(forgetUserDto: ForgetUserDto) {

    try {
     
      const {email,code } = forgetUserDto;
      const user = await this.userRepository.findOne({ 
        where: { email },
        select: { email: true }, //sólo selecciona estos atributos
      });

      if (!user)
        throw new NotFoundException('User does not exist!');
        
        
/*
      this
        .mailerService
        .sendMail({
          to: `${email}`, // list of receivers
          from: `${process.env.USER_MAIL}`, // sender address
          subject: 'Verification Code ', // Subject line
          //text: 'welcome', // plaintext body
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
          </html>`, // HTML body content
        })
        .then((success) => {
          console.log(success)
        })
        .catch((err) => {
          console.log(err)
        });
*/
      return {
        message:'Correo enviado correctamente'
        //token: this.getJwtToken( { email: user.email} )
        //token: this.getJwtToken( { id: user.id} )
      };

    } catch (error) {
      this.handleDBErrors(error);

    }

  }


    async login(loginUserDto: LoginUserDto) {

      const { password, email } = loginUserDto;
  
      const user = await this.userRepository.findOne({ 
        where: { email },
        select: { email: true, password: true, id: true }, //sólo selecciona estos atributos
      });
  
      if (!user)
        throw new UnauthorizedException('Credentials are not valid (email)');
  
      //Hace una comparación entre la contraseña recién entrada con respecto a la guardada
      if ( !bcrypt.compareSync( password, user.password)) 
        throw new UnauthorizedException('Credentials are not valid (password)');
  
      return {
        ...user,
        token: this.getJwtToken( { id: user.id} )
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
          throw new BadRequestException(error.detail)
    
        console.log(error);
        
        throw new InternalServerErrorException('Please check server logs');
    
      }
    
}
