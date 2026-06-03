import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Pusher from 'pusher';

@Injectable()
export class PusherService {
  private readonly pusher: Pusher;

  constructor(private readonly config: ConfigService) {
    this.pusher = new Pusher({
      appId: config.getOrThrow('PUSHER_APP_ID'),
      key: config.getOrThrow('PUSHER_KEY'),
      secret: config.getOrThrow('PUSHER_SECRET'),
      cluster: config.getOrThrow('PUSHER_CLUSTER'),
      useTLS: true,
    });
  }

  trigger(channel: string, event: string, data: unknown) {
    return this.pusher.trigger(channel, event, data);
  }

  authenticateChannel(socketId: string, channel: string) {
    return this.pusher.authorizeChannel(socketId, channel);
  }
}
