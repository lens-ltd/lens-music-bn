import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { comparePasswords, hashPassword } from '../helpers/encryptions.helper';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // GET USER BY EMAIL
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const userExists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .addSelect('password')
        .getOne();

      if (!userExists) {
        return null;
      }

      return userExists;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  // DELETE USER
  async deleteUser(id: string) {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      const userExists = await this.userRepository.findOne({ where: { id } });

      if (!userExists) {
        return null;
      }

      return this.userRepository.remove(userExists);
    } catch (error: any) {
      throw error;
    }
  }

  // GET USER BY ID
  async findUserById(id: string): Promise<User | null> {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      const userExists = await this.userRepository.findOne({ where: { id } });

      if (!userExists) {
        return null;
      }

      return userExists;
    } catch (error: any) {
      throw error;
    }
  }
}
