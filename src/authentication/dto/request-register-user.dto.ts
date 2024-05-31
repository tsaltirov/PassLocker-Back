import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty, IsString, Length, Matches, MaxLength } from "class-validator";

export class RequestRegisterUserDto{

    @ApiProperty({
        example: 'emailsample@gmail.com',
        description: 'User email address',
        format: 'string',
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Abc123',
        description: 'User password',
        format: 'string',
        minLength: 6,
        maxLength: 50
    })
    @IsNotEmpty()
    @IsString()
    //@Length(6, 50)
    /* @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
    }) */
    password: string;

    @ApiProperty({
        example: 'Pedro del Hierro',
        description: 'User fullname',
        format: 'string',
        minLength: 1,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    fullName: string;

    @ApiProperty({
        example: 'individual',
        description: 'Type of user',
        format: 'string',
        default: 'individual'
    })
    @IsNotEmpty()
    @IsIn(['individual','professional','pyme','organization'])
    userType: string;

}