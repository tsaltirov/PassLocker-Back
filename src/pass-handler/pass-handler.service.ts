import { BadRequestException, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/authentication/entities/user.entity';
import { PassHandler } from './entities/pass-handler.entity';
import { CreatePassHandlerDto } from './dto/create-pass-handler.dto';
import { UpdatePassHandlerDto } from './dto/update-pass-handler.dto';


//librearía de encriptación
const Cryptr = require('cryptr');





@Injectable()
export class PassHandlerService {
  
  
  constructor(
    @InjectRepository(PassHandler)
    private readonly passHandlerRepository: Repository<PassHandler>,
  ){}

  async create(createPassHandlerDto: CreatePassHandlerDto, user: User) {
    const cryptrsecret = new Cryptr(process.env.CRYPTR_SECRET); // Importante tener aquí definido el secret por el tema.ENV
    try {
     
      const { userService, userName, password } = createPassHandlerDto;
     
      //Encriptamos la pass para ser guardada.
      const passEncrypted = cryptrsecret.encrypt(password);
     
      //Registra usuario en BBDD
      const passwordRecord = this.passHandlerRepository.create({ userService, userName, password:passEncrypted, user });
      await this.passHandlerRepository.save(passwordRecord);
      delete passwordRecord.password;
      return { passwordRecord };

    } catch (error) {
      this.handleDBErrors(error);
    }
    
  }

  async findAll(user: User): Promise<PassHandler[]> {
    const cryptrsecret = new Cryptr(process.env.CRYPTR_SECRET); // Importante tener aquí definido el secret por el tema.ENV
    const queryBuilder = this.passHandlerRepository.createQueryBuilder('pass');
    const passwords = await queryBuilder
      .where('pass.userId = :userId', { userId: user.id })
      .getMany();
  
      let passDecrypted= passwords.map(valor=>valor.password=cryptrsecret.decrypt(valor.password)); // decodificamos todo el array
      return passwords;
  }

  async findById(id: string) {
    const cryptrsecret = new Cryptr(process.env.CRYPTR_SECRET);
    try {

      const password_item = await this.passHandlerRepository
        .createQueryBuilder('pass')
        .where('pass.id = :id', { id })
        .getOne();

      const passDecrypted = cryptrsecret.decrypt(password_item.password); //decodificamos contraseña
      password_item.password = passDecrypted;

      return password_item
    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  async update(id: string, updatePassHandlerDto: UpdatePassHandlerDto) {
    const cryptrsecret = new Cryptr(process.env.CRYPTR_SECRET);
    try {
      const passupdated = await this.findById(id);
      passupdated.userName = updatePassHandlerDto.userName;
      passupdated.userService = updatePassHandlerDto.userService;
      passupdated.password = cryptrsecret.encrypt(updatePassHandlerDto.password); //encriptamos la pass
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
