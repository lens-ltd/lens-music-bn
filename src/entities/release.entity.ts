import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Label } from './label.entity';
import { User } from './user.entity';
import { ReleaseArtist } from './release_artist.entity';

@Entity()
@Unique([
  'title',
  'releaseDate',
  'productionYear',
  'userId',
  'labelId',
  'version',
])
export class Release {
  // ID
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // TITLE
  @Column({ name: 'title', nullable: false })
  title!: string;

  // COVER ART
  @Column({ name: 'cover_art', nullable: true })
  coverArt: string;

  // UPC
  @Column({ name: 'upc', nullable: true })
  upc: string;

  // RELEASE DATE
  @Column({ name: 'release_date', nullable: false })
  releaseDate: string;

  // VERSION
  @Column({ name: 'version', nullable: true })
  version: string;

  // PRODUCTION YEAR
  @Column({ name: 'production_year', nullable: false })
  productionYear: number;

  // CATALOG NUMBER
  @Column({ name: 'catalog_number', nullable: true })
  catalogNumber: string;

  // LABEL ID
  @Column({ name: 'label_id', nullable: true })
  labelId: string;

  // USER ID
  @Column({ name: 'user_id', nullable: false })
  userId: string;

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
  })
  updatedAt!: Date;

  // LABEL
  @ManyToOne(() => Label, (label) => label.releases)
  @JoinColumn({ name: 'label_id' })
  label: Label;

  // USER
  @ManyToOne(() => User, (user) => user.releases)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // RELEASE ARTISTS
  @OneToMany(() => ReleaseArtist, (releaseArtist) => releaseArtist.release)
  artists: ReleaseArtist[];
}
