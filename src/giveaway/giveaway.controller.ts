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
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
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

@ApiTags('Giveaway')
@ApiBearerAuth('access_token')
@Auth(AuthType.Bearer)
@Controller('giveaway')
export class GiveawayController {
  constructor(private readonly giveawayService: GiveawayService) {}

  @Post()
  @Roles(Role.Operator, Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create giveaway', description: 'Creates a new giveaway owned by the authenticated user. Restricted to Operators and Admins.' })
  @ApiResponse({ status: 201, type: GiveawayResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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
  @ApiOperation({ summary: 'List my giveaways', description: 'Returns all giveaways created by the authenticated user, ordered by creation date descending.' })
  @ApiResponse({ status: 200, type: GiveawayResponseDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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
  @ApiOperation({ summary: 'List won giveaways', description: 'Returns all giveaways that were claimed by the authenticated user.' })
  @ApiResponse({ status: 200, type: GiveawayResponseDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Search giveaways', description: 'Public endpoint. Returns giveaways matching a creator username search. No authentication required.' })
  @ApiResponse({ status: 200, type: GiveawayResponseDto, isArray: true })
  async searchPublic(@Query() query: SearchGiveawayQueryDto) {
    const gws = await this.giveawayService.searchPublic(query.usernameSearch);
    return gws.map((gw) =>
      plainToInstance(GiveawayResponseDto, gw, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get giveaway', description: 'Returns a single giveaway by ID.' })
  @ApiResponse({ status: 200, type: GiveawayResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Giveaway not found' })
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
  @ApiOperation({ summary: 'Update giveaway', description: 'Updates a giveaway. Only the creator can update their own giveaways.' })
  @ApiResponse({ status: 200, type: GiveawayResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Giveaway not found' })
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
  @ApiOperation({ summary: 'Claim giveaway', description: 'Claims an available giveaway on behalf of the authenticated user. Returns 404 if the giveaway does not exist.' })
  @ApiResponse({ status: 202, type: GiveawayResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Giveaway not found' })
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
