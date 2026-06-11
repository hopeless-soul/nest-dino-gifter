import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateLocalUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
