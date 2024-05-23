import {
    ConflictException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class UsersRepository extends Repository<User> {
  async createUser(
    fullName: string,
    email: string,
    password: string,
    activationToken: string,
  ): Promise<void> {
    const user = this.create({ fullName, email, password, activationToken });

    try {
      await this.save(user);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('This email is already registered');
      }
      throw new InternalServerErrorException();
    }
  }
}