import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Giveaway } from '../../giveaway/entities/giveaway.entity';

@Entity()
export class User {
  // Base entity fields
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;
  
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Regular })
  role: Role;

  @Column({ default: 0 })
  tokenVersion: number;

  @Column({ default: true })
  isPublic: boolean;

  // Game fields
  @Column({ type: 'varchar', nullable: true })
  apiId: string | null;

  // Giveaway fields
  @OneToMany(() => Giveaway, giveaway => giveaway.creator)
  createdGiveaways: Giveaway[];

  @OneToMany(() => Giveaway, giveaway => giveaway.recipient)
  wonGiveaways: Giveaway[];

  // Timestamps
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date | null;
}
