import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Length } from 'class-validator';

export class ResetPasswordDto {

  @ApiProperty({
    example: '2692bd9d-2ff6-4d0b-b187-c1f1e07a8bfb',
    description: 'Reset Password Token',
    format: 'uuid',
})
  @IsNotEmpty()
  @IsUUID('4')
  resetPasswordToken: string;

  @ApiProperty({
    example: 'Abc123',
    description: 'User password',
    format: 'string',
    minLength: 6,
    maxLength: 50
})
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}