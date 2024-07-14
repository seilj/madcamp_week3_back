// src/user/user.controller.ts
//엔드포인트를 정의

import { Controller, Get, Post, Body, Param, Query,Put ,Delete, HttpException, HttpStatus, Logger, Patch} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { MyPlayer } from '../schemas/myplayer.schema';
import { FriendRequest } from 'src/schemas/friend_request.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  @Post()
  async createUser(@Body() user: User): Promise<boolean> {
    try {
      const isCreated = await this.userService.createUser(user);
      this.logger.log("saved user info")
      return isCreated;
    } catch (error) {
      this.logger.log("failed to save user info")
      throw new HttpException('User creation failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('login')
  async login(
    @Query('id') id: string,
    @Query('password') password: string,
  ): Promise<User> {
    const user = await this.userService.validateUserPassword(id, password);
    if (user) {
      return user; // Return user details if authentication is successful
    } else {
      throw new Error('Invalid credentials');
    }
  }

  @Get()
  async getUsers(@Query('kakaoId') kakaoId: string): Promise<User[]> {
    if (kakaoId) {
      return [await this.userService.getUserByKakaoId(kakaoId)];
    }
    return this.userService.getAllUsers();
  }

  @Get('exists')
    async isThereKakaoId(@Query('kakaoId') kakaoId: string): Promise<boolean>{
      const user = await this.userService.getUserByKakaoId(kakaoId);
      return !!user;
    }

  @Put()
  async updateUser(@Query('id') id: string, @Body() body: Partial<User>): Promise<User> {
    return this.userService.updateUser(id, body);
  }

  @Delete()
  async removeUser(@Query('id') id: string): Promise<User>{
    return this.userService.removeUser(id);
  }

  @Put(':userId/create-myplayer')
  async createMyPlayerForUser(
    @Param('userId') userId: string,
    @Body() myPlayerData: Partial<MyPlayer>
  ): Promise<MyPlayer> {
    return this.userService.createMyPlayerForUser(userId, myPlayerData);
  }

  @Get(':userId/myplayers')
  async getMyPlayerIds(@Param('userId') userId: string): Promise<string[]> {
    return this.userService.findPlayerIds(userId);
  }

  @Post('friend-request/:senderId/:receiverId')
  async sendFriendRequest(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ): Promise<User> {
    return this.userService.sendFriendRequest(senderId, receiverId);
  }

  @Patch(':userId/accept-friend-request/:senderId')
  async acceptFriendRequest(
    @Param('userId') userId: string,
    @Param('senderId') senderId: string,
  ): Promise<User> {
    return this.userService.acceptFriendRequest(userId, senderId);
  }

  @Patch(':userId/reject-friend-request/:senderId')
  async rejectFriendRequest(
    @Param('userId') userId: string,
    @Param('senderId') senderId: string,
  ): Promise<User> {
    return this.userService.rejectFriendRequest(userId, senderId);
  }

  @Get(':userId/pending-friend-requests')
  async getPendingRequests(@Param('userId') userId: string): Promise<FriendRequest[]> {
    return this.userService.getPendingRequests(userId);
  }

}

