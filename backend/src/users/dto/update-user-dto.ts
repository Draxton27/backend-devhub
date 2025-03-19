import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user-dto';

// DTO for updating user, based on CreateUserDto but optional
export class UpdateUserDTO extends PartialType(CreateUserDTO) {}