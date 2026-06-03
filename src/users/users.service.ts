import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashingService } from '../common/hashing/common/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly hashingService: HashingService,
  ) {}  

  createFromLocal(dto: CreateLocalUserDto) {}

  createFromAdmin(dto: CreateAdminUserDto) {}

  async findAll() {}

  async findOneById(id: string) {}

  async findOneByUser(username: string) {}

  async update(id: string, dto: UpdateAdminUserDto) {}
  

  async incrementTokenVersion(id: string): Promise<void> {
    // await this.userRepository.increment({ id }, 'tokenVersion', 1);
  }

  async softDeleteAdmin(id: string): Promise<void> {
    // const user = await this.findByIdAdmin(id);
    // user.deletedAt = new Date();
    // await this.userRepository.save(user);
  }

  async restoreAdmin(id: string): Promise<void> {}
}
