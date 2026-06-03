import { Expose } from 'class-transformer';
import type { DinoData, TrialData } from '../../common/types';
import { GiveawayCompletionStatus } from '../../common/enums/trial.enum';

export class GiveawayResponseDto {
  @Expose() id: string;
  @Expose() dino: DinoData;
  @Expose() isCanceled: boolean;
  @Expose() activeAt: Date | null;
  @Expose() trials: TrialData[] | null;
  @Expose() createdAt: Date;
  @Expose() deletedAt: Date | null;
  @Expose() completionStatus: GiveawayCompletionStatus;
}
