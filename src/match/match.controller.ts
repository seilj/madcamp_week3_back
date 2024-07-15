import { Controller, Param, Post, Get, Query, Body, UseGuards, Req, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {

  private readonly logger = new Logger(MatchController.name);
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
    this.logger.warn("matches for"+date);
    const dateTime = new Date(date);
    this.logger.warn(dateTime,"*******");
    const matches = await this.matchService.getMatchesByDate(dateTime);
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
