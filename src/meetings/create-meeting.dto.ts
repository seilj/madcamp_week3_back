import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateMeetingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  @Min(2)
  @Max(100)
  maxParticipants: number;

  @IsNotEmpty()
  @IsString()
  pubAddress: string;

  @IsNotEmpty()
  @IsString()
  supportTeam: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsString()
  creatorId: string;
}