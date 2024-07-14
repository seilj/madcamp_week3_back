// src/user/user.service.ts
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { MyPlayer, MyPlayerDocument } from 'src/schemas/myplayer.schema';
import { MyPlayerService } from '../myplayer/myplayer.service';
import { FriendRequest, FriendRequestDocument } from '../schemas/friend_request.schema';
import { Meeting } from 'src/schemas/meeting.schema';
import { MeetingsService } from 'src/meetings/meetings.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, 
    private readonly myPlayerService: MyPlayerService, 
    private readonly meetingsService: MeetingsService,
  ) {}

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
    const user = await this.userModel.findOne({ id: id }).exec();
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null; // Return user if password matches
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findOne({ id: id }).exec();
  }

  async getUserByKakaoId(kakaoId: string): Promise<User> {
    return this.userModel.findOne({ kakaoId: kakaoId }).exec();
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    for (const key in updates) {
      if (updates.hasOwnProperty(key) && key !== 'id' && key !== 'password') {
        user[key] = updates[key];
      }
    }

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

  async createMyPlayerForUser(userId: string, myPlayerData: Partial<MyPlayer>): Promise<MyPlayer> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const myPlayerId = await this.myPlayerService.generateRandomId();

    const newMyPlayer = await this.myPlayerService.createMyPlayer({
      id: myPlayerId,
      name: myPlayerData.name,
      position: myPlayerData.position,
      preferredFoot: myPlayerData.preferredFoot,
      overAll: myPlayerData.overAll,
      //공격 능력치
      dribbling: myPlayerData.dribbling,
      shooting: myPlayerData.shooting,
      offTheBall: myPlayerData.offTheBall,
      //패스능력치
      passing: myPlayerData.passing,
      firstTouch: myPlayerData.firstTouch,
      crossing: myPlayerData.crossing,
      vision: myPlayerData.vision,
      //수비능력치
      tackling: myPlayerData.tackling,
      marking: myPlayerData.marking,
      defensivePositioning: myPlayerData.defensivePositioning,
      concentration: myPlayerData.concentration,
      //신체능력치
      strength: myPlayerData.strength,
      pace: myPlayerData.pace,
      stamina: myPlayerData.stamina,
      agility: myPlayerData.agility,
      jumping: myPlayerData.jumping,
      injuryProneness: myPlayerData.injuryProneness,
      //골키퍼능력치
      reflexes: myPlayerData.reflexes,
      aeriel: myPlayerData.aeriel,
      handling: myPlayerData.handling,
      communication: myPlayerData.communication,
      commandOfArea: myPlayerData.commandOfArea,
      goalKicks: myPlayerData.goalKicks,
      throwing: myPlayerData.throwing,
    } as MyPlayer);

    if(user.myPlayerId == null)
      user.myPlayerId = [newMyPlayer.id];
    else user.myPlayerId.push(newMyPlayer.id);

    await user.save();

    return newMyPlayer;
  }

  async findPlayerIds(userId: string): Promise<string[]>{
    const user = await this.getUserById(userId);
    return user.myPlayerId;
  }

  async createDummyUsers(users: User[]): Promise<User[]> {
    return this.userModel.create(users);
  }

  async sendFriendRequest(senderId: string, receiverId: string): Promise<User> {
    const sender = await this.userModel.findOne({ id: senderId });
    const receiver = await this.userModel.findOne({ id: receiverId });

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    receiver.friendRequests.push({ senderId, status: 'pending' });
    await receiver.save();

    return receiver;
  }

  async acceptFriendRequest(userId: string, senderId: string): Promise<User> {
    const user = await this.userModel.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const request = user.friendRequests.find(
      (request) => request.senderId === senderId && request.status === 'pending',
    );
    if (!request) {
      throw new NotFoundException('Friend request not found or already processed');
    }

    const sender = await this.userModel.findOne({ id: senderId });
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    user.friends.push(sender.id);
    sender.friends.push(user.id);

    request.status = 'accepted';

    await user.save();
    await sender.save();

    return user;
  }

  async rejectFriendRequest(userId: string, senderId: string): Promise<User> {
    const user = await this.userModel.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const request = user.friendRequests.find(
      (request) => request.senderId === senderId && request.status === 'pending',
    );
    if (!request) {
      throw new NotFoundException('Friend request not found or already processed');
    }

    request.status = 'rejected';
    await user.save();

    return user;
  }

  async getPendingRequests(userId: string): Promise<FriendRequest[]> {
    const user = await this.userModel.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.friendRequests.filter((request) => request.status === 'pending');
  }

  async getMeetings(userId: string): Promise<Meeting[]>{
    const user = await this.userModel.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const meetings = await Promise.all(user.meetings.map(async (meetingId) => {
      return await this.meetingsService.findOne(meetingId);
    }));

    return meetings;
  }

  async getFriends(userId: string): Promise<User[]>{
    const user = await this.userModel.findOne({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 친구 목록의 ID를 통해 유저 정보를 가져옴
    const friends = await Promise.all(user.friends.map(async (friendId) => {
      return await this.userModel.findOne({ id: friendId });
    }));

    return friends;
  }

}