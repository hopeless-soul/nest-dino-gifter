import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from './enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { plainToInstance } from 'class-transformer';
import { FilterUsersQueryDto } from './dto/filter-users-query.dto';

@Controller('admin/users')
@Auth(AuthType.Bearer)
@Roles(Role.Admin)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAdminUserDto): Promise<AdminUserResponseDto> {
    const user = await this.usersService.createFromAdmin(dto);
    return plainToInstance(AdminUserResponseDto, user, { excludeExtraneousValues: true });
  }

  @Get()
  async findAll(@Query() query: FilterUsersQueryDto): Promise<AdminUserResponseDto[]> {
    const users = await this.usersService.findAll(query);
    return users.map((user) => plainToInstance(AdminUserResponseDto, user, { excludeExtraneousValues: true }));
  }

  @Get(':id')
  async findOne(@Query('id') id: string): Promise<AdminUserResponseDto> {
    const user = await this.usersService.findOneById(id);
    return plainToInstance(AdminUserResponseDto, user, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Query('id') id: string): Promise<void> {
    await this.usersService.softDeleteAdmin(id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restore(@Query('id') id: string): Promise<void> {
    await this.usersService.restoreAdmin(id);
  }
}
