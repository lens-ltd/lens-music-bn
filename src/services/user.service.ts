import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { comparePasswords, hashPassword } from '../utils/encryptions';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // SIGNUP
  async signup({
    email,
    name,
    phone,
    password,
    role,
  }: {
    email: string;
    name: string;
    phone: string;
    password: string;
    role: string;
  }) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }
      if (!name) {
        throw new Error('Name is required');
      }
      if (!password) {
        throw new Error('Password is required');
      }

      const hashedPassword = await hashPassword(password);

      const newUser = this.userRepository.create({
        email,
        name,
        phone,
        password: hashedPassword,
        role,
      });

      return this.userRepository.save(newUser);
    } catch (error: any) {
      throw new error();
    }
  }

  // LOGIN
  async login({ email, password }: { email: string; password: string }) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }
      if (!password) {
        throw new Error('Password is required');
      }

      const userExists = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.email', 'user.name', 'user.phone', 'user.password'])
        .where('user.email = :email', { email })
        .getOne();

      if (!userExists) {
        return null;
      }

      const isPasswordMatch = await comparePasswords(
        password,
        userExists.password
      );

      if (!isPasswordMatch) {
        return null;
      }

      return userExists;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  // GET USER BY EMAIL
  async findUserByEmail(email: string) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      return this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .addSelect('password')
        .getOne();
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
      throw new error();
    }
  }
}
