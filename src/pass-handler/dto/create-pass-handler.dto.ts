import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class CreatePassHandlerDto {
    
    @ApiProperty({
        example: 'Dropbox',
        description: 'Description of service where is used',
        format: 'string',
    })
    @IsString()
    @IsNotEmpty()
    userService: string;
    
    @ApiProperty({
        example: 'Javi2024',
        description: 'Service user name',
        format: 'string',
    })
    @IsString()
    @IsNotEmpty()
    userName: string;
    
    @ApiProperty({
        example: 'ssssssddassd5645fsddfdgdgdgd',
        description: 'Password to safe',
        format: 'string',
        uniqueItems: false,
    })
    @IsNotEmpty()
    @IsString()
    password: string;

}
