/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { firestore } from '../utils/firebase';
import { CreateUserDTO } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user-repository';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) {}
    async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        return this.userRepository.createUser(createUserDTO);
    }

    async findUserById(userId: string): Promise<User | null> {
        return this.userRepository.findUserById(userId);
    }

    async updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
        return this.userRepository.updateUser(userId, updateData);
      }
    
      async deleteUser(userId: string): Promise<boolean> {
        return this.userRepository.deleteUser(userId);
      }
}
