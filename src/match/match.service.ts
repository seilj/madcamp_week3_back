import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Match, MatchDocument } from 'src/schemas/match.schema';

@Injectable()
export class MatchService {
  constructor(@InjectModel(Match.name) private matchModel: Model<MatchDocument>) {}

  async vote(matchId: string, team: string, userId: string): Promise<Match> {
    const match = await this.matchModel.findById(matchId).exec();
    if (!match) {
      throw new Error('Match not found');
    }

    if (team === 'home') {
      if (!match.homeTeamVoters.includes(userId)) {
        match.homeTeamVotes += 1;
        match.homeTeamVoters.push(userId);
      }
    } else if (team === 'away') {
      if (!match.awayTeamVoters.includes(userId)) {
        match.awayTeamVotes += 1;
        match.awayTeamVoters.push(userId);
      }
    } else {
      throw new Error('Invalid team');
    }

    return match.save();
  }

  async getMatchesByDate(date: Date): Promise<Match[]> {
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    return await this.matchModel.find({ date: { $gte: start, $lt: end } }).exec();
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
