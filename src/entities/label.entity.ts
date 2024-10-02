import { IsEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { countries } from '../constants/data.constant';
import { Release } from './release.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
@Unique(['id'])
export class Label extends AbstractEntity {
  // NAME
  @Column({ name: 'name', length: 255, type: 'varchar', nullable: false })
  @IsEmpty({ message: 'Name is required' })
  name: string;

  // EMAIL
  @Column({ length: 255, type: 'varchar', nullable: true })
  email: string;

  // DESCRIPTION
  @Column({ name: 'description', length: 255, type: 'varchar', nullable: true })
  description: string;

  // USER ID
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  // COUNTRY
  @Column({
    name: 'country',
    type: 'enum',
    enum: countries.map((country) => country.code),
    nullable: false,
    default: 'RW',
  })
  country: string;

  // USER
  @ManyToOne(() => User, (user) => user.labels)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // RELEASES
  @OneToMany(() => Release, (release) => release.label)
  releases: Release[];
}
