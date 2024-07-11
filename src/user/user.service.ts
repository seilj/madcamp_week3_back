// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';


@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(id: number, nickname: string): Promise<User> {
    const newUser = new this.userModel({ id, nickname });
    return newUser.save();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: number): Promise<User> {
    return this.userModel.findOne({ id }).exec();
  }

  async updateUser(id: number, newNickname: string): Promise<User> {
    // Step 1: 사용자를 찾습니다.
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new DOMException('User not found');
    }

    // Step 2: 사용자의 닉네임을 업데이트하고 저장합니다.
    user.nickname = newNickname;
    await user.save();

    return user;
  }

  async removeUser(id: number): Promise<User> {
    // Step 1: 사용자를 찾습니다.
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new DOMException('User not found');
    }

    // Step 2: 사용자를 삭제합니다.
    await this.userModel.findOneAndDelete({ id }).exec();

    return user;
  }

  async createDummyUsers(users: User[]): Promise<User[]> {
    return this.userModel.create(users);
  }

}