import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class CreatePasswordModuleDto {


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
    description: string;

    @ApiProperty({
        example: 'gggff44fkvkjjr',
        description: 'User belongs',
        format: 'string',
        
    })
    @IsNotEmpty()
    @IsString()
    user_id: string;


}
