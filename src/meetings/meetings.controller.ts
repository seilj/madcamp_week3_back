import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './create-meeting.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(id);
  }
}

// import { Controller } from '@nestjs/common';

// @Controller('meetings')
// export class MeetingsController {}
