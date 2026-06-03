import { Expose } from 'class-transformer';
import type { DinoData, TrialData } from '../../common/types';

export class GiveawayResponseDto {
  @Expose() id: string;
  @Expose() dino: DinoData;
  @Expose() isCanceled: boolean;
  @Expose() activeAt: Date | null;
  @Expose() trials: TrialData[] | null;
  @Expose() createdAt: Date;
  @Expose() deletedAt: Date | null;
}
