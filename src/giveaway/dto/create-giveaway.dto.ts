import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { TrialType } from '../../common/enums/trial.enum';

export class DinoDataDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  growthLabel: string;

  @ApiProperty()
  server: string;

  @ApiProperty()
  slot: string;
}

export class TrialDataDto {
  @ApiProperty({ enum: TrialType })
  type: TrialType;

  @ApiProperty()
  data: unknown;
}

export class CreateGiveawayDto {
  @ApiProperty({ type: DinoDataDto })
  dino: DinoDataDto;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @IsDate()
  @IsOptional()
  activeAt?: Date | null;

  @ApiPropertyOptional({ type: [TrialDataDto], nullable: true })
  @IsOptional()
  trials?: TrialDataDto[] | null;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isCanceled?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  server?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slot?: string;
}
