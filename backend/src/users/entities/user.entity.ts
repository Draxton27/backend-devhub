import { Exclude } from 'class-transformer';

export class User{
    id?: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    createdAt: Date;
    lastLogin: Date;
    
    @Exclude()
    password: string;
}