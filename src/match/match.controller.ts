import { Controller, Param, Post, Get, Query, Body, UseGuards, Req, NotFoundException, BadRequestException } from '@nestjs/common';
import { MatchService } from './match.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

      @UseGuards(AuthGuard('jwt'))
      @Post(':id/vote')
      async vote(
        @Param('id') matchId: string,
        @Body('team') team: 'home' | 'away',
        @Req() req
      ) {
        const match = await this.matchService.vote(matchId, req.user.id, team);
        return match;
      }


    @Get()
    async getMatchesByDate(@Query('date') date: string) {
      const matches = await this.matchService.getMatchesByDate(new Date(date));
      return matches;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/wait')
    async addToWaitUsers(
      @Param('id') matchId: string,
      @Req() req
    ) {
      const match = await this.matchService.addToWaitUsers(matchId, req.user.id);
      return match;
    }
  }
