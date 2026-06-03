import { Module } from '@nestjs/common';
import { GiveawayService } from './giveaway.service';
import { GiveawayController } from './giveaway.controller';
import { Giveaway } from './entities/giveaway.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGiveawayController } from './admin-giveaway.controller';
import { UsersModule } from '../users/users.module';
import { GiveawayPushService } from './giveaway.gateway';
import { PusherModule } from '../pusher/pusher.module';

@Module({
  imports: [TypeOrmModule.forFeature([Giveaway]), UsersModule, PusherModule],
  controllers: [GiveawayController, AdminGiveawayController],
  providers: [GiveawayService, GiveawayPushService],
})
export class GiveawayModule {}
