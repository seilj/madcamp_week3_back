import { Controller, Param, Post, Get, Query, Body, UseGuards, Req, NotFoundException, BadRequestException } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('vote/:matchId/:team/:userId')
  async vote(
    @Param('matchId') matchId: string,
    @Param('team') team: string,
    @Param('userId') userId: string,
  ) {
    return this.matchService.vote(matchId, team, userId);
  }


  @Get('by-date')
  async getMatchesByDate(@Query('date') date: string) {
    const matches = await this.matchService.getMatchesByDate(new Date(date));
    return matches;
  }

  @Post('wait/:matchId/:userId')
  async addToWaitUsers(
    @Param('matchId') matchId: string,
    @Param('userId') userId: string,
  ) {
    return this.matchService.addToWaitUsers(matchId, userId);
  }
}
