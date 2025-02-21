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
import * as sanitizeHtml from 'sanitize-html';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private sanitizeInput(input: string): string {
    return sanitizeHtml(input.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  private validatePasswordStrength(password: string): void {
    if (!this.PASSWORD_REGEX.test(password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
      );
    }
  }

  private isValidEmail(email: string): boolean {
    // RFC 5322 compliant email regex
    const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
    return emailRegex.test(email);
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    this.logger.log(`Attempting to create user with email: ${dto.email}`);

    // Validate and sanitize email
    const sanitizedEmail = this.sanitizeInput(dto.email.toLowerCase());
    if (!this.isValidEmail(sanitizedEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check if email exists
    const existingUser = await this.userRepository.findOne({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      // Use vague message for security
      throw new BadRequestException('Invalid registration data');
    }

    // Validate password strength
    this.validatePasswordStrength(dto.password);

    // Sanitize user input
    const sanitizedFirstName = this.sanitizeInput(dto.first_name || '');
    const sanitizedLastName = this.sanitizeInput(dto.last_name || '');

    try {
      // Use strong password hashing
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      const user = new User();
      user.email = sanitizedEmail;
      user.password_hash = hashedPassword;
      user.first_name = sanitizedFirstName;
      user.last_name = sanitizedLastName;
      user.role = dto.role || UserRole.USER;
      user.is_active = true;
      user.created_at = new Date();
      user.updated_at = new Date();
      user.last_login = null;
      user.failed_login_attempts = 0;

      // Validate the entity before saving
      const errors = await validate(user);
      if (errors.length > 0) {
        throw new BadRequestException('Invalid user data');
      }

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`Successfully created user with ID: ${savedUser.id}`);
      
      // Remove sensitive data before returning
      const { password_hash, ...result } = savedUser;
      return result as unknown as User;
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

  async changeUserStatus(id: string, isActive: boolean): Promise<User> {
    const user = await this.findById(id);
    return this.updateUser(id, { is_active: isActive });
  }

  async changeUserRole(id: string, newRole: UserRole): Promise<User> {
    const user = await this.findById(id);
    return this.updateUser(id, { role: newRole });
  }

  async updateLocation(
    userId: string,
    latitude: number,
    longitude: number,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.last_latitude = latitude;
    user.last_longitude = longitude;
    user.last_location_update = new Date();

    return this.userRepository.save(user);
  }

  async findNearbyUsers(
    latitude: number,
    longitude: number,
    radiusInKm: number,
  ): Promise<User[]> {
    // Utiliser la formule de Haversine pour trouver les utilisateurs dans un rayon donné
    return this.userRepository
      .createQueryBuilder('user')
      .where(
        `
        (
          6371 * acos(
            cos(radians(:latitude)) *
            cos(radians(last_latitude)) *
            cos(radians(last_longitude) - radians(:longitude)) +
            sin(radians(:latitude)) *
            sin(radians(last_latitude))
          )
        ) <= :radius
        `,
        { latitude, longitude, radius: radiusInKm },
      )
      .andWhere('user.last_location_update IS NOT NULL')
      .andWhere('user.is_active = true')
      .getMany();
  }
}
