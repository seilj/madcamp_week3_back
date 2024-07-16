
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from 'src/schemas/meeting.schema';
import { CreateMeetingDto } from './create-meeting.dto';
import { JoinMeetingDto } from './join-meeting.dto';
import axios from 'axios';

@Injectable()
export class MeetingsService {
  constructor(@InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>) {}

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
    return newMeeting.save();
  }

  async join(joinMeetingDto: JoinMeetingDto): Promise<Meeting> {
    const { meetingId, userId } = joinMeetingDto;
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

      return meeting.save();
    } else {
      throw new Error('Meeting is full');
    }
  }
  
  async findOne(meetingId: string): Promise<Meeting> {
    return this.meetingModel.findById(meetingId);
  }

  async findAll(): Promise<Meeting[]> {
    return this.meetingModel.find().exec();
  }
}