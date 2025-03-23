/* eslint-disable */

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { LoginUserDTO } from './dto/login-user-dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user-repository';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) {}
    async createUser(createUserDTO: CreateUserDTO): Promise<User> {

      const existingUser = await this.userRepository.findUserByEmail(createUserDTO.email);
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }
        return this.userRepository.createUser(createUserDTO);
    }

    async findUserById(userId: string): Promise<User | null> {
      console.log(userId);
        return this.userRepository.findUserById(userId);
    }

    async updateUser(updateData: Partial<User>): Promise<boolean> {
      const user = await this.userRepository.findUserByEmail(updateData.email!);
      if (!user) {
        throw new BadRequestException('User not found');
      }
        return this.userRepository.updateUser(user.id!, user.name);
      }
    
    async deleteUser(email: string): Promise<boolean> {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return this.userRepository.deleteUser(user.id!);
    }
}
