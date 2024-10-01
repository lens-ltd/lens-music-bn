import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Release } from './release.entity';
import { Artist } from './artist.entity';

@Entity()
export class ReleaseArtist {
  // ID
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // RELEASE ID
  @Column({ name: 'release_id', nullable: false })
  releaseId!: string;

  // ARTIST ID
  @Column({ name: 'artist_id', nullable: false })
  artistId!: string;

  // CREATED AT
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: string;

  // UPDATED AT
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: string;

  // RELEASES
  @ManyToOne(() => Release, (release) => release.artists)
  release!: Release;

  // ARTISTS
  @ManyToOne(() => Artist, (artist) => artist.releases)
  artist!: Artist;
}
