import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/authentication/entities/user.entity';
import { PassHandler } from './entities/pass-handler.entity';
import { CreatePassHandlerDto } from './dto/create-pass-handler.dto';
import { UpdatePassHandlerDto } from './dto/update-pass-handler.dto';

@Injectable()
export class PassHandlerService {

  constructor(
    @InjectRepository(PassHandler)
    private readonly passHandlerRepository: Repository<PassHandler>,
  ){}

  async create(createPassHandlerDto: CreatePassHandlerDto, user: User) {
    try {

      const { userService, userName, password } = createPassHandlerDto;
        
      //Registra usuario en BBDD
      const passwordItem = this.passHandlerRepository.create({ userService, userName, password, user });
      await this.passHandlerRepository.save(passwordItem);
      delete passwordItem.password;
      return { passwordItem };

    } catch (error) {
      this.handleDBErrors(error);
    }
    
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

  private handleDBErrors(error:any): never {

    if( error.code === '23505')
      throw new BadRequestException(error.detail);
    
    throw new InternalServerErrorException('Please check server logs');
  
  }
}