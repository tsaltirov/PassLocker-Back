import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class DeletePassHandlerDto {


    @ApiProperty({
        example: 'ssssssddassd5645fsddfdgdgdgd',
        description: 'Id of current password',
        format: 'string',
        uniqueItems: true
    })
    @IsNotEmpty()
    @IsString()
    id: string;

    


}
