import { Controller, Get, Post, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './create-meeting.dto';
import { JoinMeetingDto } from './join-meeting.dto';
import { Meeting } from 'src/schemas/meeting.schema';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get(':userId')
  async getMeetings(@Param('userId') userId: string): Promise<Meeting[]>{
    return this.meetingsService.getMeetings(userId);
  }

  @Post()
  create(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingsService.create(createMeetingDto);
  }

  @Get()
  findAll() {
    return this.meetingsService.findAll();
  }

  @Put('join/:id')
  join(@Param('id') id: string, @Body() joinMeetingDto: JoinMeetingDto) {
    joinMeetingDto.meetingId = id;
    return this.meetingsService.join(joinMeetingDto);
  }

  @Patch('cancel/:id')
  async cancelMeeting(
    @Param('id') meetingId: string,
    @Body('userId') userId: string
  ): Promise<Meeting> {
    return this.meetingsService.cancelMeeting(userId, meetingId);
  }

  @Delete(':id')
  async deleteMeeting(@Param('id') meetingId: string): Promise<void> {
    return this.meetingsService.deleteMeeting(meetingId);
  }
}

// import { Controller } from '@nestjs/common';

// @Controller('meetings')
// export class MeetingsController {}
