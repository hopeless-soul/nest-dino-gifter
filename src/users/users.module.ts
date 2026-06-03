import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashingModule } from '../common/hashing/common/hashing.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashingModule], 
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
