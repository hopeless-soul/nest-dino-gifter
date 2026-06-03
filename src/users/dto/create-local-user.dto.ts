import { IsString, MinLength } from "class-validator";

export class CreateLocalUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}