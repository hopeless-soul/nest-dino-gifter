import {
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
  Repository,
} from 'typeorm';
import { CurrentUserData } from '../auth/types';
import { User } from '../users/entities/user.entity';
import { GiveawayCompletionStatus } from '../common/enums/trial.enum';
import { GiveawayPushService } from './giveaway.gateway';

@Injectable()
export class GiveawayService {
  constructor(
    @InjectRepository(Giveaway)
    private readonly giveawayRepository: Repository<Giveaway>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly pushService: GiveawayPushService,
  ) {}

  async create(user: CurrentUserData, dto: CreateGiveawayDto) {
    const { dino, activeAt, trials, isCanceled, server, slot } = dto;
    const giveaway = this.giveawayRepository.create({
      dino,
      activeAt,
      isCanceled,
      creator: user,
      trials,
      server,
      slot,
    });

    const saved = await this.giveawayRepository.save(giveaway);
    return this.giveawayRepository.findOne({
      where: { id: saved.id },
      relations: { creator: true, recipient: true },
    });
  }

  findAll(options?: FindManyOptions<Giveaway>) {
    return this.giveawayRepository.find({
      ...options,
      relations: { creator: true, recipient: true },
    });
  }

  findOne(id: string) {
    const giveaway = this.giveawayRepository.findOne({
      where: { id },
      relations: { creator: true, recipient: true },
    });
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

      // Lock without joins — PostgreSQL forbids FOR UPDATE on the nullable side of a LEFT JOIN
      const locked = await gRepo.findOne({
        where: { id, isCanceled: false },
        lock: { mode: 'pessimistic_write' },
      });
      if (!locked) throw new NotFoundException('Giveaway canceled or not found');

      const now = new Date();
      if (locked.activeAt && now < locked.activeAt)
        throw new MethodNotAllowedException('Giveaway has not started yet');

      // Load relations within the same transaction (row is already locked above)
      const gw = await gRepo.findOne({
        where: { id },
        relations: { creator: true, recipient: true },
      });
      if (!gw) throw new NotFoundException('Giveaway canceled or not found');

      if (gw.recipient)
        throw new MethodNotAllowedException('Giveaway has been claimed');

      const userRepo = manager.getRepository(User);
      const u = await userRepo.findOne({
        where: { id: user.id },
      });
      if (!u) throw new UnauthorizedException('User is not valid');

      gw.recipient = u;
      gw.completionStatus = GiveawayCompletionStatus.Pending;
      const saved = await gRepo.save(gw);

      await this.pushService.emitMoveDino(gw.creator.id, {
        giveawayId: gw.id,
        dino: gw.dino,
        recipientApiId: u.id,
        server: gw.server,
        slot: gw.slot,
      });

      return saved;
    });
  }
}
