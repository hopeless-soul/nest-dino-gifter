import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TrialType } from '../../common/enums/trial.enum';

export class DinoDataDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  growthLabel: string;

  @ApiProperty()
  @IsString()
  server: string;

  @ApiProperty()
  @IsString()
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
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DinoDataDto)
  dino: DinoDataDto;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
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
