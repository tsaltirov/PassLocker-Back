import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginRequestDto{

    @ApiProperty({
        example: 'emailsample@gmail.com',
        description: 'User email address',
        format: 'string',
        uniqueItems: true
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '2245',
        description: 'Verification code',
        format: 'string',
        uniqueItems: true
    })
    @IsString()
    code:string

}