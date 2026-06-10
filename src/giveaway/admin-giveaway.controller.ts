import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GiveawayService } from './giveaway.service';
import { CreateGiveawayDto } from './dto/create-giveaway.dto';
import { UpdateGiveawayDto } from './dto/update-giveaway.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Role } from '../users/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { toCurrentUserData } from '../auth/types';
import type { CurrentUserData } from '../auth/types';
import { User } from '../users/entities/user.entity';

@ApiTags('admin / giveaway')
@ApiBearerAuth('bearerAuth')
@Auth(AuthType.Bearer)
@Roles(Role.Admin)
@Controller('admin/giveaway')
export class AdminGiveawayController {
  constructor(
    private readonly giveawayService: GiveawayService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  createForCurrentUser(@CurrentUser() user: CurrentUserData, @Body() createGiveawayDto: CreateGiveawayDto) {
    return this.giveawayService.create(user, createGiveawayDto);
  }

  @Post(':id')
  async createForSpecificUser(@Param('id', ParseUUIDPipe) id: string, @Body() createGiveawayDto: CreateGiveawayDto) {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.deletedAt !== null) throw new NotFoundException('Account is inactive');
    return this.giveawayService.create(toCurrentUserData(user), createGiveawayDto);
  }

  @Get()
  findAll() {
    return this.giveawayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.giveawayService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateGiveawayDto: UpdateGiveawayDto) {
    return this.giveawayService.update(id, updateGiveawayDto);
  }
}
