import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Match, MatchDocument } from 'src/schemas/match.schema';

@Injectable()
export class MatchService {
  constructor(@InjectModel(Match.name) private matchModel: Model<MatchDocument>) {}

  async vote(matchId: string, userId: string, team: 'home' | 'away'): Promise<Match> {
    const match = await this.matchModel.findById(matchId);

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (team === 'home') {
      if (match.homeTeamVoters.includes(userId)) {
        throw new BadRequestException('You already voted for the home team');
      }
      match.homeTeamVoters.push(userId);
      match.homeTeamVotes++;
    } else {
      if (match.awayTeamVoters.includes(userId)) {
        throw new BadRequestException('You already voted for the away team');
      }
      match.awayTeamVoters.push(userId);
      match.awayTeamVotes++;
    }

    await match.save();

    return match;
  }

  async getMatchesByDate(date: Date): Promise<Match[]> {
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    return this.matchModel.find({ date: { $gte: start, $lt: end } }).exec();
  }

  async addToWaitUsers(matchId: string, userId: string): Promise<Match> {
    const match = await this.matchModel.findById(matchId);
    
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    
    if (!match.waitUsers.includes(userId)) {
      match.waitUsers.push(userId);
    }
    
    await match.save();
    
    return match;
  }

  @Cron('0 * * * * *')
  async handleCron() {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const matches = await this.matchModel.find({ startTime: { $gte: now, $lt: oneHourLater } }).exec();

    for (const match of matches) {
      for (const userId of match.waitUsers) {
        // 여기에 알림 전송 로직 추가
      }
    }
  }
}
