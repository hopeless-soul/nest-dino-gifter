import { IsBoolean, IsDate, IsJSON, IsOptional } from 'class-validator';
import { DinoData, TrialData } from '../../common/types';

export class CreateGiveawayDto {
  dino: DinoData;

  @IsDate()
  @IsOptional()
  activeAt?: Date | null;

  @IsOptional()
  trials?: TrialData[] | null;

  @IsBoolean()
  @IsOptional()
  isCanceled?: boolean;
}
