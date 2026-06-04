import { Injectable } from '@nestjs/common';
import { PusherService } from '../pusher/pusher.service';
import type { DinoData } from '../common/types';

export interface GiftDinoPayload {
  giveawayId: string;
  dino: DinoData;
  recipientApiId: string;
  recipientId: string;
  server: string | null;
  slot: string | null;
}

@Injectable()
export class GiveawayPushService {
  constructor(private readonly pusher: PusherService) {}

  emitGiftDino(creatorId: string, payload: GiftDinoPayload) {
    return this.pusher.trigger(`private-user-${creatorId}`, 'gift_dino', payload);
  }
}
