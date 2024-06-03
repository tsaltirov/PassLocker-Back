import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PassHandlerService } from './pass-handler.service';
import { User } from 'src/authentication/entities/user.entity';
import { GetUser } from 'src/authentication/decorators/get-user.decorator';
import { CreatePassHandlerDto } from './dto/create-pass-handler.dto';
import { UpdatePassHandlerDto } from './dto/update-pass-handler.dto';
import { PassHandler } from './entities/pass-handler.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('PassHandler')
@Controller('pass-handler')
export class PassHandlerController {

  constructor(
    private readonly passwordModuleService: PassHandlerService
  ) {}

  @Post('create')
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards( AuthGuard() )
  create(
    @Body() createPassHandlerDto: CreatePassHandlerDto,
    @GetUser() user: User,
  ) {
    return this.passwordModuleService.create(createPassHandlerDto, user);
  }

  @Get('findAll')
  @ApiResponse({ status: 200, description: 'Ok' })
  @UseGuards( AuthGuard() )
  findAll(
    @GetUser() user: User,
  ): Promise<PassHandler[]> {
    return this.passwordModuleService.findAll( user );
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @UseGuards( AuthGuard() )
  findOne(
    @Param('id') id: string
  ) {
    return this.passwordModuleService.findById(id
    );
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 500, description: 'Error update' })
  @UseGuards( AuthGuard() )
  update(@Param('id') id: string, @Body() updatePasswordModuleDto: UpdatePassHandlerDto) {
    return this.passwordModuleService.update( id,updatePasswordModuleDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards( AuthGuard() )
  remove(@Param('id') id: string) {
    return this.passwordModuleService.remove(id);
  }
}
