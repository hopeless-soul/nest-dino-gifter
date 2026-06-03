import { Expose } from "class-transformer";

export class UserResponseDto {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  role: string;
  @Expose()
  createdAt: Date;
  @Expose()
  deletedAt: Date | null;
}