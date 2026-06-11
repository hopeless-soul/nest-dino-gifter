import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PusherService } from './pusher.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/types';
import { PusherAuthDto } from './dto/pusher-auth.dto';

@ApiTags('Pusher')
@ApiBearerAuth('access_token')
@Controller('pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('auth')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Authenticate channel', description: 'Returns a Pusher auth token for the authenticated user\'s private channel. Rejects requests for any other channel.' })
  @ApiResponse({ status: 200, description: 'Pusher channel auth token' })
  @ApiResponse({ status: 401, description: 'Unauthorized or channel not allowed' })
  auth(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: PusherAuthDto,
  ) {
    // Only allow subscribing to the user's own private channel
    const expectedChannel = `private-user-${user.id}`;
    if (dto.channel_name !== expectedChannel) {
      throw new UnauthorizedException('Channel not allowed');
    }
    return this.pusherService.authenticateChannel(dto.socket_id, dto.channel_name);
  }
}
