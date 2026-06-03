import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../enums/role.enum";

export class CreateAdminUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}