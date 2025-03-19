/* eslint-disable */

import { Controller, Get, Post, Body, Param, Patch, Req, Delete } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from "./dto/update-user-dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Post()
    async create(@Body() createUserDTO: CreateUserDTO) {
        return this.usersService.createUser(createUserDTO);
    }

    @Get(':id')
    async findById(@Param() params: { id: string }) {
        const userId = params.id;
        console.log("Controller received id:", userId);
        const user = await this.usersService.findUserById(userId);
        if (!user) {
            return { message: 'User not found' };
        }
        return user;
    }
    

    @Patch(':email')
    async update(@Param("email") email: string, @Body() updateUserDto: UpdateUserDTO) {
        return this.usersService.updateUser(email, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param() id: string) {
        return this.usersService.deleteUser(id);
    }
}
