import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { Meeting, MeetingSchema } from '../schemas/meeting.schema';
import { MeetingsGateway } from './meetings.gateway'; // MeetingsGateway를 import

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]), // MongooseModule 설정
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingsGateway], // MeetingsGateway를 providers에 추가
  exports: [MeetingsService],
})
export class MeetingsModule {}