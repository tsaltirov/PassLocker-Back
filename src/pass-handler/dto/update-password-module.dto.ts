import { PartialType } from '@nestjs/swagger';
import { CreatePasswordModuleDto } from './create-password-module.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordModuleDto extends PartialType(CreatePasswordModuleDto) {

    @ApiProperty({
        example: 'ssssssddassd5645fsddfdgdgdgd',
        description: 'Current id password',
        format: 'string',
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({
        example: 'ssssssdsdadada33dassd5645fsddfdgdgdgd',
        description: 'New password to set',
        format: 'string',
        
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    username: string;

    @IsString()
    userservice: string;


}

