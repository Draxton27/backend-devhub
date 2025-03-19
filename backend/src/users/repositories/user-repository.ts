/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { firestore } from '../../utils/firebase';
import { CreateUserDTO } from '../dto/create-user-dto';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { collection } from 'firebase/firestore';

@Injectable()
export class UserRepository {
  private collection: FirebaseFirestore.CollectionReference;
  constructor() {
    this.collection = firestore.collection('users');
  }

  // create a new user
  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    try { 
      const userId = uuidv4();
      const userRef = this.collection.doc(userId);

      // hash password before
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDTO.password, saltRounds);

      const newUser: User = {
        id: userId,
        name: createUserDTO.name,
        email: createUserDTO.email,
        password: hashedPassword,
        image: createUserDTO.image,
        role: 'user',
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      await userRef.set(newUser);
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // find user by ID
  async findUserById(userId: string): Promise<User | null> {
    console.log("UserId before fetching from Firestore:", JSON.stringify(userId));
    try {
      if (!userId || typeof userId !== 'string') {
        console.log(userId);
        throw new Error("Invalid userId: userId is null or undefined.");
      }
      const userRef = this.collection.doc(userId);
      const userSnap = await userRef.get();

      const userData = userSnap.data() as User;
      console.log("User found:", userData);
      return userData;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  // update a user's data
  async updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
    try {
      if (!userId) {
        throw new Error("Invalid userId: userId is required.");
      }

      const userRef = this.collection.doc(userId);
      await userRef.update({ ...updateData, updatedAt: new Date() });
      return this.findUserById(userId);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // delete a user
  async deleteUser(userId: string): Promise<boolean> {
    try {
      if (!userId) {
        throw new Error("Invalid userId: userId is required.");
      }
      const userRef = this.collection.doc(userId);
      await userRef.delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}
