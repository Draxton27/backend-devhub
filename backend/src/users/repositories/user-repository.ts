/* eslint-disable */

import { BadRequestException, Injectable } from '@nestjs/common';
import { firestore } from '../../utils/firebase';
import { CreateUserDTO } from '../dto/create-user-dto';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { collection } from 'firebase/firestore';
import * as admin from 'firebase-admin';

@Injectable()
export class UserRepository {
  private collection: FirebaseFirestore.CollectionReference;
  constructor() {
    this.collection = firestore.collection('users');
  }

  private readonly firestore = admin.firestore();
  private readonly auth = admin.auth();

  // create a new user
  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    try { 
      // const existingUser = await this.findUserByEmail(createUserDTO.email);
      // if (existingUser) {
      //   throw new BadRequestException('User already exists');
      // }

      const userRecord = await this.auth.createUser({
        email: createUserDTO.email,
        password: createUserDTO.password,
        displayName: createUserDTO.name,
      });
      // hash password before
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDTO.password, saltRounds);

      const newUser: User = {
        id: userRecord.uid,
        name: createUserDTO.name,
        email: createUserDTO.email,
        password: hashedPassword,
        image: createUserDTO.image ?? 'https://example.com/default.png',
        role: 'user',
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      await this.firestore.collection('users').doc(userRecord.uid).set(newUser);
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // find user by ID
  async findUserById(userId: string): Promise<User | null> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error("Invalid userId: userId is null or undefined.");
      }

      const userRecord = await this.auth.getUser(userId);
      const userRef = this.firestore.collection('users').doc(userRecord.uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return null;
      }

      return userSnap.data() as User;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email || typeof email !== 'string') {
        throw new Error("Invalid email: email is required.");
      }
      const userRecord = await this.auth.getUserByEmail(email);

      const userRef = this.firestore.collection('users').doc(userRecord.uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return null;
      }

      // const userData = userSnap.data() as User;
      return userSnap.data() as User;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async updateLastLogin(userId: string) {
    try {
      await this.firestore.collection('users').doc(userId).update({
        lastLogin: new Date(),
      });
    } catch(error) {
      console.log(`Error updating user: ${error.message}`);
    }
  }

  // update a user's data
  async updateUser(userId: string, userName: string): Promise<boolean>{
    try {
      await this.firestore.collection('users').doc(userId).update({
        name: userName
      });
      return true;
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
      await this.auth.deleteUser(userId);
      await this.firestore.collection('users').doc(userId).delete();

      return true;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}