import { Controller, Param, Post, Body, UseGuards, Req, NotFoundException, BadRequestException } from '@nestjs/common';
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
        const match = await this.matchService.vote(matchId, req.user._id, team);
        return match;
      }
  }
