import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FriendRequest } from './friend_request.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true }) // 중복 ID를 허용하지 않도록 unique 설정
  id: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({ type: [String] })
  favoriteLeagues: string[];

  @Prop({ type: [String] })
  favoriteTeams: string[];

  @Prop({ type: [String] })
  favoritePlayers: string[];

  @Prop({ default: 0 }) // 포인트는 기본값 0으로 설정
  points: number;

  @Prop()
  kakaoId?: String;

  @Prop()
  email?: string;

  @Prop()
  city?: string;

  @Prop()
  myPlayerId?: string[];

  @Prop({ type: [String], default: [] }) // 친구 목록
  friends: string[];

  @Prop({ type: [FriendRequest], default: []})
  friendRequests: FriendRequest[];
}


export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);