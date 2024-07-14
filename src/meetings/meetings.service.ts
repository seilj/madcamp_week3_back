import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from 'src/schemas/meeting.schema';
import axios from 'axios';

@Injectable()
export class MeetingsService {
  constructor(@InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>) {}

  // 주소를 위도와 경도로 변환하는 함수 (카카오 API 사용)
  async getCoordinates(address: string): Promise<{ longitude: number, latitude: number }> {
    const apiKey = '6cf381adbd9cf31b14c1db80c010a446';
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

  // 새로운 모임 생성
  async create(title: string, maxParticipants: number, pubAddress: string, supportTeam: string, date: string, time: string): Promise<Meeting> {
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
    });
    return newMeeting.save();
  }

  // 모임에 참가
  async join(meetingId: string, userId: string): Promise<Meeting> {
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

      // 최대 참가자수에 도달하면 모집 마감
      if (meeting.currentParticipants >= meeting.maxParticipants) {
        meeting.isClosed = true;
      }

      return meeting.save();
    } else {
      throw new Error('Meeting is full');
    }
  }

  // 특정 모임 조회
  async findOne(meetingId: string): Promise<Meeting> {
    return this.meetingModel.findById(meetingId);
  }

  // 모든 모임 조회
  async findAll(): Promise<Meeting[]> {
    return this.meetingModel.find().exec();
  }
}