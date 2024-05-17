import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ForgetUserDto{
//
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    code:string

    
}