import { IsEmail, IsIn, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class RequestRegisterUserDto{

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    //@Length(6, 50)
    /* @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
    }) */
    password: string;

    
    @IsNotEmpty()
    @IsString()
    @Length(2, 20)
    fullName: string;

    @IsNotEmpty()
    @IsIn(['individual','professional','pyme','organization'])
    userType: string;

}