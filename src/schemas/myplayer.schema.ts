import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MyPlayerDocument = MyPlayer & Document;

const MIN = 0;
const MAX = 150;

@Schema()
export class MyPlayer {
  @Prop({ unique: true, required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['공격수', '미드필더', '수비수', '골키퍼'] })
  position: string;

  @Prop({ required: true, enum: ['왼발', '오른발'] })
  preferredFoot: string;

  @Prop({required: true })
  overAll: number;

  // 공격능력치 (포지션이 골키퍼가 아닌 경우)
  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  dribbling?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  shooting?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  offTheBall?: number;

//패스 능력치
  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  passing?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  firstTouch?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  crossing?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  vision?: number;

  // 수비능력치 (포지션이 골키퍼가 아닌 경우)
  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  tackling?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  marking?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  defensivePositioning?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position !== '골키퍼'; } })
  concentration?: number;

  // 신체능력치
  @Prop({ type: Number, min: MIN, max: MAX, required: true })
  strength: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: true })
  pace: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: true })
  stamina: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: true })
  agility: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: true })
  jumping: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: true })
  injuryProneness: number;

  // 골키퍼 능력치 (포지션이 골키퍼인 경우)
  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position === '골키퍼'; } })
  reflexes?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position === '골키퍼'; } })
  aeriel?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position === '골키퍼'; } })
  handling?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position === '골키퍼'; } })
  communication?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position === '골키퍼'; } })
  commandOfArea?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position === '골키퍼'; } })
  goalKicks?: number;

  @Prop({ type: Number, min: MIN, max: MAX, required: function() { return this.position === '골키퍼'; } })
  throwing?: number;
}

export const MyPlayerSchema = SchemaFactory.createForClass(MyPlayer);