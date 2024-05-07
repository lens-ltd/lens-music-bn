import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Artist } from '../entities/artist.entity';
import { getPagingData } from '../helpers/pagination.helper';
import { UUID } from 'crypto';

export class ArtistService {
  private artistRepository: Repository<Artist>;

  constructor() {
    this.artistRepository = AppDataSource.getRepository(Artist);
  }

  // CREATE ARTIST
  async createArtist({
    name,
    status,
    userId,
  }: {
    name: string;
    status: string;
    userId: UUID;
  }): Promise<Artist> {
    try {
      if (!name) {
        throw new Error('Name is required');
      }

      const newArtist = this.artistRepository.create({
        name,
        status,
        userId,
      });

      return this.artistRepository.save(newArtist);
    } catch (error: any) {
      throw error;
    }
  }

  // FETCH ALL ARTISTS
  async fetchArtists({
    condition,
    take,
    skip,
  }: {
    condition?: object;
    take?: number;
    skip?: number;
  }): Promise<{
    rows: Artist[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const artists = await this.artistRepository.findAndCount({
        where: condition,
        take,
        skip,
        relations: ['user'],
      });

      return getPagingData(artists, take, skip);
    } catch (error: any) {
      throw error;
    }
  }

  // GET ARTIST BY ID
  async getArtistById(id: string): Promise<Artist | null> {
    try {
      if (!id) {
        throw new Error('Artist ID is required');
      }

      return this.artistRepository.findOne({
        where: { id },
        relations: ['user'],
      });
    } catch (error: any) {
      throw error;
    }
  }

  // UPDATE ARTIST
  async updateArtist({
    id,
    name,
    status,
    userId,
  }: {
    id: UUID;
    name: string;
    status: string;
    userId: UUID;
  }): Promise<Artist> {
    try {
      if (!id) {
        throw new Error('Artist ID is required');
      }

      return this.artistRepository.save({ id, name, status, userId });
    } catch (error: any) {
      throw error;
    }
  }

  // DELETE ARTIST
  async deleteArtist(id: UUID) {
    try {
      // IF ID IS NOT PROVIDED
      if (!id) {
        throw new Error('Artist ID is required');
      }
      // DELETE ARTIST
      return this.artistRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
