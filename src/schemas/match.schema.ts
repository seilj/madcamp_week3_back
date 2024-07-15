import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema()
export class Match extends Document {
  @Prop({ required: true })
  league: string;

  @Prop({ required: true })
  homeTeam: string;

  @Prop({ required: true })
  awayTeam: string;

  @Prop({ required: true })
  startTime: Date;

  //승부예측 및 응원 오픈톡 스키마 등록
  @Prop({ default: 0 })
   homeTeamVotes: number;

  @Prop({ default: 0 })
  awayTeamVotes: number;

  @Prop({ type: [{ type: String, ref: 'User' }], default: []})
  homeTeamVoters: string[];

  @Prop({ type: [{ type: String, ref: 'User' }], default: []})
  awayTeamVoters: string[];



  @Prop({ default: 0 })
  homeTeamScore: number;

  @Prop({ default: 0 })
  awayTeamScore: number;

  @Prop({ type: [{ type: String, ref: 'User' }], default: []})
  waitUsers: string[];
}

export type MatchDocument = Match & Document;
export const MatchSchema = SchemaFactory.createForClass(Match);