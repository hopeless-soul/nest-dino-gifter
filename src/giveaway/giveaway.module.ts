import { Module } from '@nestjs/common';
import { GiveawayService } from './giveaway.service';
import { GiveawayController } from './giveaway.controller';
import { Giveaway } from './entities/giveaway.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGiveawayController } from './admin-giveaway.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Giveaway]), UsersModule],
  controllers: [GiveawayController, AdminGiveawayController],
  providers: [GiveawayService],
})
export class GiveawayModule {}
