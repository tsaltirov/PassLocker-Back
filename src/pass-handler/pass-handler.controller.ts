import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassHandlerService } from './pass-handler.service';
import { CreatePassHandlerDto } from './dto/create-pass-handler.dto';
import { UpdatePassHandlerDto } from './dto/update-pass-handler.dto';

@Controller('pass-handler')
export class PassHandlerController {
  constructor(private readonly passwordModuleService: PassHandlerService) {}

  @Post('create')
  create(@Body() createPassHandlerDto: CreatePassHandlerDto) {
    return this.passwordModuleService.create(createPassHandlerDto);
  }

  @Get()
  findAll() {
    return this.passwordModuleService.findAll();
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
