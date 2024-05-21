import { IsEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { countries } from '../constants/data.constant';
import { Release } from './release.entity';

@Entity()
@Unique(['id'])
export class Label {
  // ID
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  // CREATED AT
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // UPDATED AT
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;

  // USER
  @ManyToOne(() => User, (user) => user.labels)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // RELEASES
  @OneToMany(() => Release, (release) => release.label)
  releases: Release[];
}
