import { PartialType } from '@nestjs/swagger';
import { CreatePassHandlerDto } from './create-pass-handler.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePassHandlerDto extends PartialType(CreatePassHandlerDto) {

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

    @IsOptional()
    @IsString()
    userName?: string;

    @IsOptional()
    @IsString()
    userService?: string;


}

