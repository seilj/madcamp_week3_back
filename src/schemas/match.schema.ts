import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema()
export class Match extends Document {
  @Prop({ required: true }) // 중복 ID를 허용하지 않도록 unique 설정
  date: Date;

  @Prop({ required: true })
  league: string;

  @Prop({ required: true })
  homeTeam: string;

  @Prop({ required: true })
  awayTeam: string;

  @Prop({ required: true })
  startTime: string;

  //승부예측 및 응원 오픈톡 스키마 등록
  @Prop({ default: 0 })
   homeTeamVotes: number;

    @Prop({ default: 0 })
    awayTeamVotes: number;

    @Prop({ type: [{ type: String, ref: 'User' }] })
    homeTeamVoters: string[];

    @Prop({ type: [{ type: String, ref: 'User' }] })
    awayTeamVoters: string[];



  @Prop({ default: 0 })
  homeTeamScore: number;

  @Prop({ default: 0 })
  awayTeamScore: number;



}

export type MatchDocument = Match & Document;
export const MatchSchema = SchemaFactory.createForClass(Match);