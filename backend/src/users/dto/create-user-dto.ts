import { IsEmail, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';
export class CreateUserDTO{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}