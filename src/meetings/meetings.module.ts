import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { Meeting, MeetingSchema } from '../schemas/meeting.schema';
import { MeetingsGateway } from './meetings.gateway'; // MeetingsGateway를 import
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingsGateway],
  exports: [MeetingsService],
})
export class MeetingsModule {}