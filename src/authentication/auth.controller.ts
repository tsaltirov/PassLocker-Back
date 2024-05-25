import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { LoginRequestDto } from './dto/login-request.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestRegisterUserDto } from './dto/request-register-user.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from './entities/user.entity';

@ApiTags('User authentication')
@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService ){};

    @Post('request-register-account')
    @ApiResponse({ status: 201, description: 'Email sent successfully' })
    @ApiResponse({ status: 201, description: 'User already registered', type: User })
    registerUser(@Body() requestRegisterUserDto: RequestRegisterUserDto) {
      return this.authService.requestRegisterUser(requestRegisterUserDto);
    }
    
    @Post('register-account')
    @ApiResponse({ status: 201, description: 'Successfully registered user', type: User })
    @ApiResponse({ status: 400, description: 'Bad request' })
    activateAccount(@Body() requestRegisterUserDto: RequestRegisterUserDto){
      return this.authService.registerUser(requestRegisterUserDto);
    }

    @Post('login-request')
    @ApiResponse({ status: 201, description: 'Email sent successfully' })
    loginRequest(@Body() loginRequestDto: LoginRequestDto) {
      return this.authService.loginRequest(loginRequestDto);
    }
    
    @Post('login')
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    loginUser(@Body() loginUserDto: LoginUserDto): Promise<{accessToken: string}> {
      return this.authService.login(loginUserDto);
    }

    @Patch('request-reset-password')
    @ApiResponse({ status: 200, description: 'Email sent successfully' })
    requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
    ) {
      return this.authService.requestResetPassword(requestResetPasswordDto);
    }

    @Patch('/reset-password')
    @ApiResponse({ status: 200, description: 'Account successfully reset' })
    @ApiResponse({ status: 422, description: 'This action can not be done' })
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return this.authService.resetPassword(resetPasswordDto);
    }
}


