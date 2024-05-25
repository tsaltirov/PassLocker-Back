import { IsEmail, IsString } from "class-validator";

export class LoginRequestDto{

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    code:string

}