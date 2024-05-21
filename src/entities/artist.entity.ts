import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { STATUSES } from '../constants/artist.constants';
import { User } from './user.entity';
import { ReleaseArtist } from './release_artist.entity';

@Entity()
export class Artist {
  // ID
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // NAME
  @Column({ name: 'name', nullable: false })
  name!: string;

  // STATUS
  @Column({
    name: 'status',
    nullable: false,
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.ACTIVE,
  })
  status!: string;

  // USER ID
  @Column({ name: 'user_id', nullable: false })
  userId!: string;

  // CREATED AT
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  // UPDATED AT
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  // USER
  @ManyToOne(() => User, (user) => user.artists)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // RELEASE ARTISTS
  @OneToMany(() => ReleaseArtist, (releaseArtist) => releaseArtist.artist)
  releases: ReleaseArtist[];
}
