import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class FriendRequest {
  @Prop({ required: true })
  senderId: string;

  @Prop({ default: 'pending' }) // 요청 상태: pending, accepted, rejected
  status: string;
}

export type FriendRequestDocument = FriendRequest & Document;
export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);