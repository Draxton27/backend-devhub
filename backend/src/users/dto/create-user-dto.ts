import { IsEmail, IsNotEmpty, IsOptional, IsString, Min, MinLength } from '@nestjs/class-validator';
export class CreateUserDTO{
    @IsString()
    @IsNotEmpty()
    id: string;

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
    @MinLength(6)
    password: string;
}