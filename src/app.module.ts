import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HashingModule } from './common/hashing/common/hashing.module';
import { AuthModule } from './auth/auth.module';
import { GiveawayModule } from './giveaway/giveaway.module';
import { PusherModule } from './pusher/pusher.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    DatabaseModule,
    HashingModule, AuthModule, GiveawayModule, PusherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
