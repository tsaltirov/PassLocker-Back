import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDto {

  @ApiProperty({
    example: 'emailsample@gmail.com',
    description: 'User email address',
    format: 'string',
    uniqueItems: true
})
  @IsNotEmpty()
  @IsEmail()
  email: string;
}