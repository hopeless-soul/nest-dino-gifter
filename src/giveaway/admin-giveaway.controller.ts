import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
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
import { GiveawayResponseDto } from './dto/giveaway-response.dto';
import { plainToInstance } from 'class-transformer';

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
  async createForCurrentUser(
    @CurrentUser() user: CurrentUserData,
    @Body() createGiveawayDto: CreateGiveawayDto,
  ): Promise<GiveawayResponseDto> {
    const gw = await this.giveawayService.create(user, createGiveawayDto);
    return plainToInstance(GiveawayResponseDto, gw, {
      excludeExtraneousValues: true,
    });
  }

  @Post(':id')
  async createForSpecificUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createGiveawayDto: CreateGiveawayDto,
  ): Promise<GiveawayResponseDto> {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.deletedAt !== null)
      throw new NotFoundException('Account is inactive');
    const gw = this.giveawayService.create(
      toCurrentUserData(user),
      createGiveawayDto,
    );
    return plainToInstance(GiveawayResponseDto, gw, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(): Promise<GiveawayResponseDto[]> {
    const gws = await this.giveawayService.findAll();
    return gws.map((gw) =>
      plainToInstance(GiveawayResponseDto, gw, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GiveawayResponseDto> {
    const gw = await this.giveawayService.findOne(id);
    return plainToInstance(GiveawayResponseDto, gw, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGiveawayDto: UpdateGiveawayDto,
  ): Promise<GiveawayResponseDto> {
    const gw = await this.giveawayService.update(id, updateGiveawayDto);
    return plainToInstance(GiveawayResponseDto, gw, {
      excludeExtraneousValues: true,
    });
  }
}
