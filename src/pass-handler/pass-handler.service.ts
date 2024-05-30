import { Injectable } from '@nestjs/common';
import { CreatePassHandlerDto } from './dto/create-pass-handler.dto';
import { UpdatePassHandlerDto } from './dto/update-pass-handler.dto';

@Injectable()
export class PassHandlerService {
  create(createPassHandlerDto: CreatePassHandlerDto) {
    return 'This action adds a new passwordModule';
  }

  findAll() {
    return `This action returns all passwordModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} passwordModule`;
  }

  update(id: number, updatePassHandlerDto: UpdatePassHandlerDto) {
    return `This action updates a #${id} passwordModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} passwordModule`;
  }
}
