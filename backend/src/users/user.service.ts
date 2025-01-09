/* eslint-disable @typescript-eslint/no-unused-vars */
// users.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './roles.enum';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    this.logger.log(`Attempting to create user with email: ${dto.email}`);

    if (!this.isValidEmail(dto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Validation simplifiée du mot de passe
    if (dto.password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      const user = this.userRepository.create({
        ...dto,
        password_hash: hashedPassword,
        role: dto.role || UserRole.USER,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`Successfully created user with ID: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new BadRequestException('Could not create user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        this.logger.error(`User not found with email: ${email}`);
        throw new NotFoundException('User not found');
      }

      this.logger.debug(`User found: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error(`Error finding all users: ${error.message}`);
      throw error;
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);

    try {
      if (updateData.password_hash) {
        const salt = await bcrypt.genSalt(10);
        updateData.password_hash = await bcrypt.hash(
          updateData.password_hash,
          salt,
        );
      }

      updateData.updated_at = new Date();
      Object.assign(user, updateData);

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`Successfully updated user with ID: ${id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`);
      throw new BadRequestException('Could not update user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
      this.logger.log(`Successfully deleted user with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`);
      throw error;
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(password, user.password_hash);
      this.logger.debug(
        `Password validation result for user ${user.email}: ${isValid}`,
      );
      return isValid;
    } catch (error) {
      this.logger.error(`Error validating password: ${error.message}`);
      return false;
    }
  }

  async hasAdminUser(): Promise<boolean> {
    try {
      const adminCount = await this.userRepository.count({
        where: { role: UserRole.ADMIN },
      });
      return adminCount > 0;
    } catch (error) {
      this.logger.error(`Error checking admin existence: ${error.message}`);
      return false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validation simplifiée du mot de passe
  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  async changeUserStatus(id: string, isActive: boolean): Promise<User> {
    const user = await this.findById(id);
    return this.updateUser(id, { is_active: isActive });
  }

  async changeUserRole(id: string, newRole: UserRole): Promise<User> {
    const user = await this.findById(id);
    return this.updateUser(id, { role: newRole });
  }
}
