import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, FindOneOptions, IsNull, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashingService } from '../common/hashing/common/hashing.service';
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { FilterUsersQueryDto } from './dto/filter-users-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly hashingService: HashingService,
  ) {}

  createFromLocal(dto: CreateLocalUserDto) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const userRepo = manager.getRepository(User);
      const { username, password } = dto;

      const exist = await userRepo.findOne({
        where: { username },
        withDeleted: true,
      });
      if (exist) {
        throw new ConflictException('Username already exists');
      }

      const hashedPassword = await this.hashingService.hash(password);
      const user = userRepo.create({
        username,
        password: hashedPassword,
      });

      try {
        const saved = await userRepo.save(user);
        return saved;
      } catch (error: any) {
        if (error?.code === '23505') {
          throw new ConflictException('Email already exists');
        }
        throw error;
      }
    });
  }

  createFromAdmin(dto: CreateAdminUserDto) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const userRepo = manager.getRepository(User);
      const { username, password, role } = dto;

      const exist = await userRepo.findOne({
        where: { username },
        withDeleted: true,
      });
      if (exist) {
        throw new ConflictException('Username already exists');
      }

      const hashedPassword = await this.hashingService.hash(password);
      const user = userRepo.create({
        username,
        password: hashedPassword,
        role,
      });

      try {
        const saved = await userRepo.save(user);
        return saved;
      } catch (error: any) {
        if (error?.code === '23505') {
          throw new ConflictException('Email already exists');
        }
        throw error;
      }
    });
  }

  async findAll(query: FilterUsersQueryDto) {
    const { search, role, isDeleted } = query;
    const where: any = { deletedAt: IsNull() };

    if (search) {
      where.username = search;
    }

    if (role) {
      where.role = role;
    }

    if (isDeleted !== undefined) {
      where.deletedAt = isDeleted ? Not(IsNull()) : IsNull();
    }

    return this.userRepository.find({ where, relations: { createdGiveaways: true, wonGiveaways: true } });
  }

  async findOneById(id: string, options?: FindOneOptions<User>) {
    return this.userRepository.findOne({ where: { id }, ...options });
  }

  async findOneByUsername(username: string, options?: FindOneOptions<User>) {
    return this.userRepository.findOne({ where: { username }, ...options });
  }

  async update(id: string, dto: UpdateAdminUserDto) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { username, password, role, apiId } = dto;
    if (username) user.username = username;
    if (password) user.password = await this.hashingService.hash(password);
    if (apiId !== undefined) user.apiId = apiId === '' ? null : apiId;
    if (role) user.role = role;
    if ((dto as any).isPublic !== undefined) user.isPublic = (dto as any).isPublic;

    return this.userRepository.save(user);
  }

  async incrementTokenVersion(id: string): Promise<void> {
    await this.userRepository.increment({ id }, 'tokenVersion', 1);
  }

  async softDeleteAdmin(id: string): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }

  async restoreAdmin(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id }, withDeleted: true }); 
    if (!user) {  
      throw new NotFoundException('User not found');
    }

    user.deletedAt = null;
    await this.userRepository.save(user);
  }
}
