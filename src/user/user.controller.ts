// src/user/user.controller.ts
//엔드포인트를 정의

import { Controller, Get, Post, Body, Param, Query,Put ,Delete} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body('id') id: number, @Body('nickname') nickname: string): Promise<User> {
    return this.userService.createUser(id, nickname);
  }


  @Get()
  async getUsers(@Query('id') id: number): Promise<User[]> {
    if (id) {
      return [await this.userService.getUserById(id)];
    }
    return this.userService.getAllUsers();
  }

  @Get('exists')
    async isThereId(@Query('id') id: number): Promise<boolean>{
      const user = await this.userService.getUserById(id);
      return !!user;
    }

  @Put('nickname')
    async updateUser(@Query('id') id: number, @Body() body:{nickname: string}) : Promise<User>{
      const {nickname}= body;
      return this.userService.updateUser(id, nickname);
    }

  @Delete()
  async removeUser(@Query('id') id: number): Promise<User>{
    return this.userService.removeUser(id);
  }

}
