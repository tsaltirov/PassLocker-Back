import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ActivateUserDto } from './dto/activate-user.dto';

import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';


@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService ){};

    @Post('register')
    registerUser(@Body() registerUserDto: RegisterUserDto): Promise<{}> {
      return this.authService.registerUser(registerUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto): Promise<{accessToken: string}> {
      return this.authService.login(loginUserDto);
    }

    @Get('activate-account')
    activateAccount(@Query() activateUserDto: ActivateUserDto){
      return this.authService.activateUser(activateUserDto);
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


