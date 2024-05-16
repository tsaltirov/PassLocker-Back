import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgetUserDto } from './dto/forget-user.dto';

@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService ){};

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
      return this.authService.create(createUserDto);
    }

    @Post('registerMail')
    registerMail(@Body() createUserDto: CreateUserDto) {
      return this.authService.registermail(createUserDto);//se ha añadido al createuserdto el roles
    }

    @Post('forgetMail')
    forgetMail(@Body() forgetUserDto: ForgetUserDto) {
      return this.authService.twofa(forgetUserDto);//se ha añadido al createuserdto el roles
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
      return this.authService.login(loginUserDto);
    }
}


