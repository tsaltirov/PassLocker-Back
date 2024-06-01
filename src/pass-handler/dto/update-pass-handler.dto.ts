import { PartialType } from '@nestjs/swagger';
import { CreatePassHandlerDto } from './create-pass-handler.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePassHandlerDto extends PartialType(CreatePassHandlerDto) {
}

