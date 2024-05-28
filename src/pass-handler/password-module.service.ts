import { Injectable } from '@nestjs/common';
import { CreatePasswordModuleDto } from './dto/create-password-module.dto';
import { UpdatePasswordModuleDto } from './dto/update-password-module.dto';

@Injectable()
export class PasswordModuleService {
  create(createPasswordModuleDto: CreatePasswordModuleDto) {
    return 'This action adds a new passwordModule';
  }

  findAll() {
    return `This action returns all passwordModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} passwordModule`;
  }

  update(id: number, updatePasswordModuleDto: UpdatePasswordModuleDto) {
    return `This action updates a #${id} passwordModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} passwordModule`;
  }
}
