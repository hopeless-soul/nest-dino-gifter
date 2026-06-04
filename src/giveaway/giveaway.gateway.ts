import { Injectable } from '@nestjs/common';
import { PusherService } from '../pusher/pusher.service';
import type { DinoData } from '../common/types';

export interface MoveDinoPayload {
  giveawayId: string;
  dino: DinoData;
  recipientApiId: string;
  server: string | null;
  slot: string | null;
}

@Injectable()
export class GiveawayPushService {
  constructor(private readonly pusher: PusherService) {}

  emitMoveDino(creatorId: string, payload: MoveDinoPayload) {
    return this.pusher.trigger(`private-user-${creatorId}`, 'move_dino', payload);
  }
}
