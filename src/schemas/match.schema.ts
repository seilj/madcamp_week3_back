import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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

  @Prop({ default: 0 })
  homeTeamScore: number;

  @Prop({ default: 0 })
  awayTeamScore: number;

  @Prop({ default: 0 })
  homeTeamPoints: number;

  @Prop({ default: 0 })
  awayTeamPoints: number;
}

export type MatchDocument = Match & Document;
export const MatchSchema = SchemaFactory.createForClass(Match);