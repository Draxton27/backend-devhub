/* eslint-disable */

import { Controller, Get, Post, Body, Param, Patch, Req, Delete } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from "./dto/update-user-dto";
import { LoginUserDTO } from "./dto/login-user-dto";
import { UserRepository } from "./repositories/user-repository";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
        private readonly userRepository: UserRepository
    ) {}
    @Post()
    async create(@Body() createUserDTO: CreateUserDTO) {
        return this.usersService.createUser(createUserDTO);
    }

    @Get('me')
    async getMe(@Req() req) {
        const uid = req.user?.uid;
        if (!uid) return { message: 'No user found' };

        const user = await this.usersService.findUserById(uid);
        this.userRepository.updateLastLogin(uid);
        return user;
    }
    @Get(':id')
    async findById(@Param() params: { id: string }) {
        const userId = params.id;
        const user = await this.usersService.findUserById(userId);
        if (!user) {
            return { message: 'User not found' };
        }
        return user;
    }
    
    @Patch('update')
    async update(@Body() updateUserDto: UpdateUserDTO) {
        return this.usersService.updateUser(updateUserDto);
    }

    @Delete(':email')
    async delete(@Param() params: { email: string }) {
        return this.usersService.deleteUser(params.email);
    }
}
