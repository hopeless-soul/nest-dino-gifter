import { IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../enums/role.enum";

export class CreateAdminUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}