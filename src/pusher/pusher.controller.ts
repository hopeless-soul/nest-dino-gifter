import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { PusherService } from './pusher.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/types';

@Controller('pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('auth')
  @Auth(AuthType.Bearer)
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
