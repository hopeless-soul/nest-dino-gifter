import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGiveawayDto } from './dto/create-giveaway.dto';
import { UpdateGiveawayDto } from './dto/update-giveaway.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Giveaway } from './entities/giveaway.entity';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CurrentUserData } from '../auth/types';

@Injectable()
export class GiveawayService {
  constructor(
    @InjectRepository(Giveaway)
    private readonly giveawayRepository: Repository<Giveaway>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(user: CurrentUserData, dto: CreateGiveawayDto) {
    const { dino, activeAt, trials, isCanceled } = dto;
    const giveaway = this.giveawayRepository.create({
      dino,
      activeAt,
      isCanceled,
      creator: user,
      trials,
    });

    return await this.giveawayRepository.save(giveaway);
  }

  findAll(options?: FindManyOptions<Giveaway>) {
    return this.giveawayRepository.find({ ...options });
  }

  findOne(id: string) {
    const giveaway = this.giveawayRepository.findOne({ where: { id } });
    if (!giveaway) throw new NotFoundException('Giveaway not found');
    return giveaway;
  }

  async update(id: string, dto: UpdateGiveawayDto, options?: FindOneOptions<Giveaway>) {
    const giveaway = await this.giveawayRepository.findOne({ where: { id }, ...options });
    if (!giveaway) throw new NotFoundException('Giveaway not found');

    const { dino, activeAt, trials, isCanceled } = dto;
    if (dino) giveaway.dino = dino;
    if (activeAt) giveaway.activeAt = activeAt;
    if (trials) giveaway.trials = trials;
    if (isCanceled) giveaway.isCanceled = isCanceled;

    return this.giveawayRepository.save(giveaway);
  }

  remove(id: string) {
    return this.giveawayRepository.delete(id);
  }
}
