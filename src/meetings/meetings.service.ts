import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from 'src/schemas/meeting.schema';

@Injectable()
export class MeetingsService {
  constructor(@InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>) {}

  // 새로운 모임 생성
  async create(title: string, maxParticipants: number, pubAddress: string, supportTeam: string, date: string, time: string): Promise<Meeting> {
    const newMeeting = new this.meetingModel({
      title,
      maxParticipants,
      pubAddress,
      supportTeam,
      date,
      time,
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