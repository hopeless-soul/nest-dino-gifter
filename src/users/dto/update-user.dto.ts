import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  apiId?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
