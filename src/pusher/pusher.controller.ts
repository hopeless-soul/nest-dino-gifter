import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PusherService } from './pusher.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/types';

@ApiTags('pusher')
@Controller('pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('auth')
  @Auth(AuthType.Bearer)
  @ApiResponse({ status: 200, description: 'Pusher channel auth token' })
  @ApiResponse({ status: 401, description: 'Unauthorized or channel not allowed' })
  auth(
    @CurrentUser() user: CurrentUserData,
    @Body('socket_id') socketId: string,
    @Body('channel_name') channelName: string,
  ) {
    // Only allow subscribing to the user's own private channel
    const expectedChannel = `private-user-${user.id}`;
    if (channelName !== expectedChannel) {
      throw new UnauthorizedException('Channel not allowed');
    }
    return this.pusherService.authenticateChannel(socketId, channelName);
  }
}
