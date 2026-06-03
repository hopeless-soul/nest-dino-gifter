import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { Src\common\hashingModule } from './src/common/hashing/src/common/hashing.module';
import { Common\hashingModule } from './common/hashing/common/hashing.module';
import { Common\hashingService } from './common/hashing/common/hashing.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    DatabaseModule,
    Src\common\hashingModule, Common\hashingModule,
  ],
  controllers: [AppController],
  providers: [AppService, Common\hashingService],
})
export class AppModule {}
