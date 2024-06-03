import { BadRequestException, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

      const passEncrypted = bcrypt.hashSync(password, 10);
        
      //Registra usuario en BBDD
      const passwordItem = this.passHandlerRepository.create({ userService, userName, password: passEncrypted, user });
      await this.passHandlerRepository.save(passwordItem);
      delete passwordItem.password;
      return { passwordItem };

    } catch (error) {
      this.handleDBErrors(error);
    }
    
  }

  async findAll(user: User): Promise<PassHandler[]> {
    const queryBuilder = this.passHandlerRepository.createQueryBuilder('pass');
    const passwords = await queryBuilder
      .where('pass.userId = :userId', { userId: user.id })
      .getMany();
  
    return passwords;
  }

  async findById(id: string) {
    try {

      const password_item = await this.passHandlerRepository
        .createQueryBuilder('pass')
        .where('pass.id = :id', { id })
        .getOne();

      return password_item
    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  async update(id: string, updatePassHandlerDto: UpdatePassHandlerDto) {
    try {
      const passupdated = await this.findById(id);
      passupdated.userName = updatePassHandlerDto.userName;
      passupdated.userService = updatePassHandlerDto.userService;
      passupdated.password = bcrypt.hashSync(updatePassHandlerDto.password,10);
      this.passHandlerRepository.save(passupdated);
      return {
        message:'Modificada con éxito'
      };
    } catch (error) {
      this.handleDBErrors(error);
      
    }
  }

  async remove(id: string) {
    try {
      const passwordRemove = await this.passHandlerRepository.delete(id);
      return {
        message: 'Contraseña eliminada',
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error:any): never {
    
    if( error.code === '23505')
      throw new BadRequestException(error.detail);
    if(error.code ==='22P02')
      throw new BadRequestException('No existe el valor');
    
    throw new InternalServerErrorException('Please check server logs');
  
  }
}
