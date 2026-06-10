import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TrialType } from '../../common/enums/trial.enum';

export class DinoDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  growthLabel: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  server: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slot: string;
}

export class TrialDataDto {
  @ApiProperty({ enum: TrialType })
  @IsEnum(TrialType)
  type: TrialType;

  @ApiProperty()
  @IsOptional()
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
  @ValidateNested({ each: true })
  @Type(() => TrialDataDto)
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
