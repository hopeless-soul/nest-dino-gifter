import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TrialType } from '../../common/enums/trial.enum';

export class DinoDataDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  growthLabel: string;

  @IsString()
  @IsNotEmpty()
  server: string;

  @IsString()
  @IsNotEmpty()
  slot: string;
}

export class TrialDataDto {
  @IsEnum(TrialType)
  type: TrialType;

  @IsOptional()
  data: unknown;
}

export class CreateGiveawayDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DinoDataDto)
  dino: DinoDataDto;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  activeAt?: Date | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TrialDataDto)
  trials?: TrialDataDto[] | null;

  @IsBoolean()
  @IsOptional()
  isCanceled?: boolean;

  @IsString()
  @IsOptional()
  server?: string;

  @IsString()
  @IsOptional()
  slot?: string;
}
