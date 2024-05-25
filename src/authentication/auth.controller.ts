import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginRequestDto } from './dto/login-request.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestRegisterUserDto } from './dto/request-register-user.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService ){};

    @Post('request-register-account')
    registerUser(@Body() requestRegisterUserDto: RequestRegisterUserDto) {
      return this.authService.requestRegisterUser(requestRegisterUserDto);
    }

    @Post('register-account')
    activateAccount(@Body() requestRegisterUserDto: RequestRegisterUserDto){
      return this.authService.registerUser(requestRegisterUserDto);
    }

    @Post('login-request')
    loginRequest(@Body() loginRequestDto: LoginRequestDto) {
      return this.authService.loginRequest(loginRequestDto);
    }
    
    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto): Promise<{accessToken: string}> {
      return this.authService.login(loginUserDto);
    }

    @Patch('request-reset-password')
    requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
    ) {
      return this.authService.requestResetPassword(requestResetPasswordDto);
    }

    @Patch('/reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return this.authService.resetPassword(resetPasswordDto);
    }
}


