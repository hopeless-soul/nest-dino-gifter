import { Expose, Type } from 'class-transformer';
import type { DinoData, TrialData } from '../../common/types';
import { GiveawayCompletionStatus } from '../../common/enums/trial.enum';

class GiveawayUserDto {
  @Expose() id: string;
  @Expose() username: string;
  @Expose() role: string;
  @Expose() apiId: string | null;
}

export class GiveawayResponseDto {
  @Expose() id: string;
  @Expose() dino: DinoData;
  @Expose() isCanceled: boolean;
  @Expose() activeAt: Date | null;
  @Expose() trials: TrialData[] | null;
  @Expose() createdAt: Date;
  @Expose() deletedAt: Date | null;
  @Expose() completionStatus: GiveawayCompletionStatus;
  @Expose() @Type(() => GiveawayUserDto) creator: GiveawayUserDto;
  @Expose() @Type(() => GiveawayUserDto) recipient: GiveawayUserDto | null;
  @Expose() server: string;
  @Expose() slot: string;
}
