import {
  ForbiddenException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateGiveawayDto } from './dto/create-giveaway.dto';
import { UpdateGiveawayDto } from './dto/update-giveaway.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Giveaway } from './entities/giveaway.entity';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CurrentUserData } from '../auth/types';
import { User } from '../users/entities/user.entity';
import { GiveawayCompletionStatus } from '../common/enums/trial.enum';

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

  async update(
    id: string,
    dto: UpdateGiveawayDto,
    options?: FindOneOptions<Giveaway>,
  ) {
    const giveaway = await this.giveawayRepository.findOne({
      where: { id },
      ...options,
    });
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

  async claim(id: string, user: CurrentUserData) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const gRepo = manager.getRepository(Giveaway);
      const gw = await gRepo.findOne({
        where: { id, isCanceled: false },
        lock: { mode: 'pessimistic_write' },
      });
      if (!gw) throw new NotFoundException('Giveaway canceled or not found');

      const now = new Date();
      if (gw.activeAt && now < gw.activeAt)
        throw new MethodNotAllowedException('Giveaway has not started yet');

      if (gw.recepient)
        throw new MethodNotAllowedException('Giveaway has been claimed');

      const userRepo = manager.getRepository(User);
      const u = await userRepo.findOne({
        where: { id: user.id, deletedAt: undefined },
      });
      if (!u) throw new UnauthorizedException('User is not valid');

      gw.recepient = u;
      gw.completionStatus = GiveawayCompletionStatus.Pending;
      return await gRepo.save(gw);
    });
  }
}
