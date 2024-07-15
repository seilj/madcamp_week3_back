import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from 'src/schemas/match.schema';

@Injectable()
export class MatchService {
    @Injectable()
    export class MatchService {
      constructor(@InjectModel(Match.name) private matchModel: Model<MatchDocument>) {}

      async vote(matchId: string, userId: string, team: 'home' | 'away'): Promise<Match> {
        const match = await this.matchModel.findById(matchId);

        if (!match) {
          throw new NotFoundException('Match not found');
        }

        if (team === 'home') {
          if (match.homeTeamVotes.includes(userId)) {
            throw new BadRequestException('You already voted for the home team');
          }
          match.homeTeamVotes.push(userId);
        } else {
          if (match.awayTeamVotes.includes(userId)) {
            throw new BadRequestException('You already voted for the away team');
          }
          match.awayTeamVotes.push(userId);
        }

        await match.save();

        return match;
      }


    }
