import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PassHandlerService } from './pass-handler.service';
import { User } from 'src/authentication/entities/user.entity';
import { GetUser } from 'src/authentication/decorators/get-user.decorator';
import { CreatePassHandlerDto } from './dto/create-pass-handler.dto';
import { UpdatePassHandlerDto } from './dto/update-pass-handler.dto';
import { PassHandler } from './entities/pass-handler.entity';

@Controller('pass-handler')
export class PassHandlerController {

  constructor(
    private readonly passwordModuleService: PassHandlerService
  ) {}

  @Post('create')
  @UseGuards( AuthGuard() )
  create(
    @Body() createPassHandlerDto: CreatePassHandlerDto,
    @GetUser() user: User,
  ) {
    return this.passwordModuleService.create(createPassHandlerDto, user);
  }

  @Get('findAll')
  @UseGuards( AuthGuard() )
  findAll(
    @GetUser() user: User,
  ): Promise<PassHandler[]> {
    return this.passwordModuleService.findAll( user );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePasswordModuleDto: UpdatePassHandlerDto) {
    return this.passwordModuleService.update(+id, updatePasswordModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordModuleService.remove(+id);
  }
}
