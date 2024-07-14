import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type MeetingDocument = Meeting & Document;

@Schema()
export class Meeting {

  @Prop({ unique: true, required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true }) //최대 참여자수
  maxParticipants: number;

  @Prop({ default: 0 }) //현재 참여자수
  currentParticipants: number;

  @Prop({ type: [String], default: [] })  //현재 참여자들(아이디 기반)
  participants: string[];

  @Prop({ required: true }) //펍의 주소
  pubAddress: string;

  @Prop({ required: true }) //응원하는 축구 팀
  supportTeam: string;

  @Prop({ required: true })
  date: string; // 'YYYY-MM-DD' 형식(축구 관람 날짜)

  @Prop({ required: true })
  time: string; // 'HH:mm~HH:mm' 형식(축구 관람 시간)

  @Prop({ default: false }) //펍 예약 가능 여부
  isClosed: boolean;
  @Prop({ required: true }) // 경도
  longitude: number;

  @Prop({ required: true }) // 위도
  latitude: number;
}
export const MeetingSchema = SchemaFactory.createForClass(Meeting);