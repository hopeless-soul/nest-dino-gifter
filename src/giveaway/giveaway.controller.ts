import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GiveawayService } from './giveaway.service';
import { CreateGiveawayDto } from './dto/create-giveaway.dto';
import { UpdateGiveawayDto } from './dto/update-giveaway.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Role } from '../users/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Auth(AuthType.Bearer)
@Controller('giveaway')
export class GiveawayController {
  constructor(private readonly giveawayService: GiveawayService) {}

  @Post()
  @Roles(Role.Operator, Role.Admin)
  create(@CurrentUser() user, @Body() createGiveawayDto: CreateGiveawayDto) {
    return this.giveawayService.create(user, createGiveawayDto);
  }

  @Get()
  @Roles(Role.Operator, Role.Admin)
  findAll(@CurrentUser() user) {
    return this.giveawayService.findAll({ where: { creator: user } });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giveawayService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Operator, Role.Admin)
  update(@Param('id') id: string, @Body() updateGiveawayDto: UpdateGiveawayDto, @CurrentUser() user) {
    return this.giveawayService.update(id, updateGiveawayDto, { where: { creator: user } });
  }
}
