import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PasswordModuleService } from './password-module.service';
import { CreatePasswordModuleDto } from './dto/create-password-module.dto';
import { UpdatePasswordModuleDto } from './dto/update-password-module.dto';

@Controller('password-module')
export class PasswordModuleController {
  constructor(private readonly passwordModuleService: PasswordModuleService) {}

  @Post()
  create(@Body() createPasswordModuleDto: CreatePasswordModuleDto) {
    return this.passwordModuleService.create(createPasswordModuleDto);
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
  update(@Param('id') id: string, @Body() updatePasswordModuleDto: UpdatePasswordModuleDto) {
    return this.passwordModuleService.update(+id, updatePasswordModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordModuleService.remove(+id);
  }
}
