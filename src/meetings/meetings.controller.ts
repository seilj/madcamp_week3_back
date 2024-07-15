import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './create-meeting.dto';
import { JoinMeetingDto } from './join-meeting.dto';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

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
}

// import { Controller } from '@nestjs/common';

// @Controller('meetings')
// export class MeetingsController {}
