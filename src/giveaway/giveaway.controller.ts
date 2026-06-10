import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GiveawayService } from './giveaway.service';
import { CreateGiveawayDto } from './dto/create-giveaway.dto';
import { UpdateGiveawayDto } from './dto/update-giveaway.dto';
import { SearchGiveawayQueryDto } from './dto/search-giveaway-query.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Role } from '../users/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/types';

@ApiTags('giveaway')
@ApiBearerAuth('bearerAuth')
@Auth(AuthType.Bearer)
@Controller('giveaway')
export class GiveawayController {
  constructor(private readonly giveawayService: GiveawayService) {}

  @Post()
  @Roles(Role.Operator, Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: CurrentUserData, @Body() createGiveawayDto: CreateGiveawayDto) {
    return this.giveawayService.create(user, createGiveawayDto);
  }

  @Get()
  @Roles(Role.Operator, Role.Admin)
  findAll(@CurrentUser() user: CurrentUserData) {
    return this.giveawayService.findAll({ where: { creator: user }, order: { createdAt: 'DESC' } });
  }

  @Get('won')
  findWon(@CurrentUser() user: CurrentUserData) {
    return this.giveawayService.findAll({ where: { recipient: { id: user.id } } });
  }

  @Get('search')
  @Auth(AuthType.None)
  searchPublic(@Query() query: SearchGiveawayQueryDto) {
    return this.giveawayService.searchPublic(query.usernameSearch);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.giveawayService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Operator, Role.Admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateGiveawayDto: UpdateGiveawayDto, @CurrentUser() user: CurrentUserData) {
    return this.giveawayService.update(id, updateGiveawayDto, { where: { creator: user } });
  }

  @Post(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async claim(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: CurrentUserData) {
    return this.giveawayService.claim(id, user)
  }
}
