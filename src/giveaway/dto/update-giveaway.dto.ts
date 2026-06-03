import { PartialType } from '@nestjs/swagger';
import { CreateGiveawayDto } from './create-giveaway.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GiveawayCompletionStatus } from '../../common/enums/trial.enum';

export class UpdateGiveawayDto extends PartialType(CreateGiveawayDto) {
  @IsEnum(GiveawayCompletionStatus)
  @IsOptional()
  completionStatus?: GiveawayCompletionStatus;
}
