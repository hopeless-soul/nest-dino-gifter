import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
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
import { GiveawayResponseDto } from './dto/giveaway-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('giveaway')
@ApiBearerAuth('bearerAuth')
@Auth(AuthType.Bearer)
@Controller('giveaway')
export class GiveawayController {
  constructor(private readonly giveawayService: GiveawayService) {}

  @Post()
  @Roles(Role.Operator, Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() createGiveawayDto: CreateGiveawayDto,
  ): Promise<GiveawayResponseDto> {
    const gw = await this.giveawayService.create(user, createGiveawayDto);
    return plainToInstance(GiveawayResponseDto, gw, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @Roles(Role.Operator, Role.Admin)
  async findAll(
    @CurrentUser() user: CurrentUserData,
  ): Promise<GiveawayResponseDto[]> {
    const gws = await this.giveawayService.findAll({
      where: { creator: user },
      order: { createdAt: 'DESC' },
    });
    return gws.map((gw) =>
      plainToInstance(GiveawayResponseDto, gw, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('won')
  async findWon(
    @CurrentUser() user: CurrentUserData,
  ): Promise<GiveawayResponseDto[]> {
    const gws = await this.giveawayService.findAll({
      where: { recipient: { id: user.id } },
    });
    return gws.map((gw) =>
      plainToInstance(GiveawayResponseDto, gw, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('search')
  @Auth(AuthType.None)
  async searchPublic(@Query() query: SearchGiveawayQueryDto) {
    const gws = await this.giveawayService.searchPublic(query.usernameSearch);
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
  @Roles(Role.Operator, Role.Admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGiveawayDto: UpdateGiveawayDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<GiveawayResponseDto> {
    const gw = await this.giveawayService.update(id, updateGiveawayDto, {
      where: { creator: user },
    });
    return plainToInstance(GiveawayResponseDto, gw, {
      excludeExtraneousValues: true,
    });
  }

  @Post(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async claim(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<GiveawayResponseDto> {
    const gw = await this.giveawayService.claim(id, user);
    return plainToInstance(GiveawayResponseDto, gw, {
      excludeExtraneousValues: true,
    });
  }
}
