import { DeleteResult, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Label } from '../entities/label.entity';
import { getPagingData } from '../helpers/pagination.helper';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

export class LabelService {
  private labelRepository: Repository<Label>;
  private userService = new UserService();

  constructor() {
    this.labelRepository = AppDataSource.getRepository(Label);
  }

  // CREATE LABEL
  async createLabel({
    name,
    email,
    description,
    userId,
    country,
  }: {
    name: string;
    email: string;
    description: string;
    userId: string;
    country: string;
  }): Promise<Label> {
    try {
      if (!name) {
        throw new Error('Name is required');
      }

      if (!userId) {
        throw new Error('User ID is required');
      }

      // CHECK IF USER EXISTS
      const userExists = await this.userService.findUserById(userId);

      // IF USER NOT FOUND
      if (!userExists) {
        throw new Error('User not found');
      }

      const newLabel = this.labelRepository.create({
        name,
        email,
        description,
        userId,
        country: country.toUpperCase(),
      });

      return this.labelRepository.save(newLabel);
    } catch (error: any) {
      throw error;
    }
  }

  // FETCH LABELS
  async fetchLabels({
    condition,
    take,
    skip,
  }: {
    condition?: object;
    take: number;
    skip: number;
  }): Promise<{
    rows: Label[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const labels = await this.labelRepository.findAndCount({
        where: condition,
        relations: ['user'],
        take,
        skip,
      });
      return getPagingData(labels, take, skip);
    } catch (error: any) {
      throw error;
    }
  }

  // GET LABEL BY ID
  async getLabelById(id: string): Promise<Label | null> {
    try {
      // IF ID IS NOT PROVIDED
      if (!id) {
        throw new Error('Label ID is required');
      }

      // FIND LABEL BY ID
      const label = await this.labelRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      // IF LABEL NOT FOUND
      if (!label) {
        return null;
      }

      return label;
    } catch (error: any) {
      throw error;
    }
  }

  // UPDATE LABEL
  async updateLabel({
    id,
    name,
    email,
    description,
    country,
  }: {
    id: string;
    name: string;
    email: string;
    description: string;
    country: string;
  }): Promise<Label | null> {
    try {
      // IF ID IS NOT PROVIDED
      if (!id) {
        throw new Error('Label ID is required');
      }

      // FIND LABEL BY ID
      const labelExists = await this.labelRepository.findOne({ where: { id } });

      // IF LABEL NOT FOUND
      if (!labelExists) {
        return null;
      }

      // UPDATE LABEL
      labelExists.name = name || labelExists.name;
      labelExists.email = email || labelExists.email;
      labelExists.description = description || labelExists.description;
      labelExists.country = country.toUpperCase() || labelExists.country;

      return this.labelRepository.save(labelExists);
    } catch (error: any) {
      throw error
    }
  }

  // DELETE LABEL
  async deleteLabel(id: string): Promise<DeleteResult | null> {
    try {
      // IF ID IS NOT PROVIDED
      if (!id) {
        throw new Error('Label ID is required');
      }

      // DELETE LABEL
      return await this.labelRepository.delete(id);
    } catch (error: any) {
      throw error;
    }
  }
}
