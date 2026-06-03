import { Expose, Type } from "class-transformer";
import { GiveawayResponseDto } from "../../giveaway/dto/giveaway-response.dto";

export class UserResponseDto {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  role: string;

  @Expose()
  apiId: string | null;
  @Expose()
  @Type(() => GiveawayResponseDto)
  createdGiveaways: GiveawayResponseDto[];
  @Expose()
  @Type(() => GiveawayResponseDto)
  wonGiveaways: GiveawayResponseDto[];
  
  @Expose()
  createdAt: Date;
  @Expose()
  deletedAt: Date | null;
}