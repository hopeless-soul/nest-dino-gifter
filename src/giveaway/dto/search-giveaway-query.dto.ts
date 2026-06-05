import { IsString, MinLength } from 'class-validator';

export class SearchGiveawayQueryDto {
  @IsString()
  @MinLength(1)
  usernameSearch: string;
}
