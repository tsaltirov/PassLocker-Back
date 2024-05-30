import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class CreatePassHandlerDto {


    @ApiProperty({
        example: 'ssssssddassd5645fsddfdgdgdgd',
        description: 'Password to safe',
        format: 'string',
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        example: 'Dropbox',
        description: 'Description of service where is used',
        format: 'string',
        
    })
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    userService: string;

}
