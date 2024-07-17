
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from 'src/schemas/meeting.schema';
import { CreateMeetingDto } from './create-meeting.dto';
import { JoinMeetingDto } from './join-meeting.dto';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class MeetingsService {
  constructor(@InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
  private readonly userService: UserService,
) {}

async getMeetings(userId: string): Promise<Meeting[]>{
  const user = await this.userService.getUserById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const meetings = await Promise.all(user.meetings.map(async (meetingId) => {
    return await this.meetingModel.findById(meetingId);
  }));

  return meetings;
}

  async getCoordinates(address: string): Promise<{ longitude: number, latitude: number }> {
    const apiKey = '22f40ccdc4442898c8643d005848ae3d'; // 여기에 REST API 키를 입력하세요
    const response = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
      params: {
        query: address,
      },
    });
  
    if (response.data.documents && response.data.documents.length > 0) {
      const location = response.data.documents[0].address;
      return { longitude: parseFloat(location.x), latitude: parseFloat(location.y) };
    } else {
      throw new Error('Failed to fetch coordinates');
    }
  }

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const { title, maxParticipants, pubAddress, supportTeam, date, time, creatorId } = createMeetingDto;
    const { longitude, latitude } = await this.getCoordinates(pubAddress);

    const newMeeting = new this.meetingModel({
      title,
      maxParticipants,
      pubAddress,
      supportTeam,
      date,
      time,
      longitude,
      latitude,
      creatorId,
      currentParticipants: 1,
      participants: [creatorId],
    });
    const savedMeeting = await newMeeting.save();
    await this.userService.addMeeting(creatorId, savedMeeting._id.toString());
    return savedMeeting;
  }

  async join(joinMeetingDto: JoinMeetingDto): Promise<Meeting> {
    const { meetingId, userId } = joinMeetingDto;
  
    try {
      // meetingId가 올바른 형식인지 확인합니다.
      console.log('meetingId:', meetingId);
  
      // 데이터베이스에서 미팅 검색
      const meeting = await this.meetingModel.findById(meetingId);
  
      if (!meeting) {
        throw new Error('Meeting not found');
      }
  
      if (meeting.isClosed) {
        throw new Error('Meeting is closed');
      }
  
      if (meeting.currentParticipants < meeting.maxParticipants) {
        meeting.participants.push(userId);
        meeting.currentParticipants += 1;
  
        if (meeting.currentParticipants >= meeting.maxParticipants) {
          meeting.isClosed = true;
        }

        await this.userService.addMeeting(userId, meetingId);
  
        return meeting.save();
      } else {
        throw new Error('Meeting is full');
      }
    } catch (error) {
      console.error('Error in join method:', error);
      throw error;
    }
  }

  async cancelMeeting(userId: string, meetingId: string): Promise<Meeting> {
    try {
      // 데이터베이스에서 미팅 검색
      const meeting = await this.meetingModel.findById(meetingId);
      
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      if (!meeting.participants.includes(userId)) {
        throw new Error('User is not a participant of the meeting');
      }

      // 미팅의 참여자 목록에서 유저 제거
      meeting.participants = meeting.participants.filter(participant => participant !== userId);
      meeting.currentParticipants -= 1;

      // 만약 미팅이 닫혀있었다면 열어줍니다.
      if (meeting.isClosed && meeting.currentParticipants < meeting.maxParticipants) {
        meeting.isClosed = false;
      }

      // 유저의 meetings에서 미팅 ID 제거
      await this.userService.removeMeeting(userId, meetingId);

      return meeting.save();
    } catch (error) {
      console.error('Error in cancelMeeting method:', error);
      throw error;
    }
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    try {
      // 데이터베이스에서 미팅 검색
      const meeting = await this.meetingModel.findById(meetingId);

      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // 미팅의 참가자 목록에서 모든 유저의 meetings 배열에서 미팅 ID 제거
      await Promise.all(meeting.participants.map(async (userId) => {
        await this.userService.removeMeeting(userId, meetingId);
      }));

      // 미팅 삭제
      await this.meetingModel.deleteOne({ _id: meetingId });
    } catch (error) {
      console.error('Error in deleteMeeting method:', error);
      throw error;
    }
  }
  
  async findOne(meetingId: string): Promise<Meeting> {
    return this.meetingModel.findById(meetingId);
  }

  async findAll(): Promise<Meeting[]> {
    return this.meetingModel.find().exec();
  }
}