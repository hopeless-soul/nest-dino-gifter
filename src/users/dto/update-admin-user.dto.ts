import { PartialType } from "@nestjs/swagger";
import { CreateAdminUserDto } from "./create-admin-user.dto";
import { IsOptional } from "class-validator";

export class UpdateAdminUserDto extends PartialType(CreateAdminUserDto) {
  @IsOptional()
  apiId?: string;
}