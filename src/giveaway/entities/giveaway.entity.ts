import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { DinoData, TrialData } from '../../common/types';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Giveaway {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  dino: DinoData;

  // Note: calculated based on `recepient` filed
  // @Column({ default: false })
  // redeemed: boolean;

  @Column({ default: false })
  isCanceled: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  activeAt: Date | null;

  @ManyToOne(() => User, (user) => user.createdGiveaways)
  creator: User;

  @ManyToOne(() => User, (user) => user.wonGiveaways, { nullable: true })
  recepient: User | null;

  @Column({ type: 'json', nullable: true, default: null })
  trials: TrialData[] | null;

  // Timestamps
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date | null;
}
