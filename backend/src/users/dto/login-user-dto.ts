import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class LoginUserDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
