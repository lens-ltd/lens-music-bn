import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ROLES } from '../constants/auth.constant';
import { Label } from './label.entity';
import { Artist } from './artist.entity';
import { Release } from './release.entity';

@Entity()
@Unique(['email', 'id'])
export class User {
  // ID
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // EMAIL
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  // NAME
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  // PHONE
  @Column({ name: 'phone', type: 'varchar', length: 255, nullable: true })
  phone: string;

  // PASSWORD
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  // ROLE
  @Column({
    name: 'role',
    type: 'enum',
    nullable: false,
    default: ROLES.USER,
    enum: Object.values(ROLES),
  })
  role!: string;

  // CREATED AT
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  // UPDATED AT
  @CreateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @OneToMany(() => Label, (label) => label.user)
  labels: Label[];

  // ARTISTS
  @OneToMany(() => Artist, (artist) => artist.user)
  artists: Artist[];

  // RELEASES
  @OneToMany(() => Release, (release) => release.user)
  releases: Release[];
}
