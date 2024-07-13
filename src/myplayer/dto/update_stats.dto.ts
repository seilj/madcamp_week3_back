import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { MIN, MAX } from '../constants';

export class UpdateStatsDto {
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) dribbling?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) shooting?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) passing?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) firstTouch?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) crossing?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) vision?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) offTheBall?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) tackling?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) marking?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) defensivePositioning?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) concentration?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) strength?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) pace?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) stamina?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) agility?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) jumping?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) injuryProneness?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) reflexes?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) aeriel?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) handling?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) communication?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) commandOfArea?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) goalKicks?: number;
  @IsOptional() @IsNumber() @Min(MIN) @Max(MAX) throwing?: number;
}