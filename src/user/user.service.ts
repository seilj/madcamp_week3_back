// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';


@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: User): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new this.userModel({
        ...user,
        password: hashedPassword,
      });
      await newUser.save();
      return true; // 유저가 정상적으로 생성되었음을 나타냅니다.
    } catch (error) {
      return false; // 유저 생성 실패를 나타냅니다.
    }
  }

  async validateUserPassword(id: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null; // Return user if password matches
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserByKakaoId(kakaoId: string): Promise<User> {
    return this.userModel.findOne({ kakaoId: kakaoId }).exec();
  }

  async updateUser(id: string, newNickname: string): Promise<User> {
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

  async removeUser(id: string): Promise<User> {
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