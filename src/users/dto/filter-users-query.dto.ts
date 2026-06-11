import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';
import { Role } from "../enums/role.enum";

export class FilterUsersQueryDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isDeleted?: boolean;
}
