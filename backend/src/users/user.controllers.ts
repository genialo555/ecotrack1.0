/* eslint-disable prettier/prettier */
// src/users/user.controllers.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Logger,
  BadRequestException,
  HttpStatus,
  HttpCode,
 } from '@nestjs/common';
 import { UsersService } from './user.service';
 import { JwtAuthGuard } from '../auth/jwt-auth.guard';
 import { RolesGuard } from '../auth/roles.guard';
 import { Roles } from '../auth/roles.decorator';
 import { UserRole } from './roles.enum';
 import { CreateUserDto } from './create-user.dto';
 import { UpdateUserDto } from './update-user.dto';
 import { User } from './user.entity';
 import { CurrentUser } from '../auth/current-user.decorator';
 
 @Controller('admin/users')
 @UseInterceptors(ClassSerializerInterceptor)
 @UseGuards(JwtAuthGuard, RolesGuard)
 export class UsersController {
  private readonly logger = new Logger(UsersController.name);
 
  constructor(private readonly usersService: UsersService) {}
 
  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Creating new user with email: ${createUserDto.email}`);
    try {
      const user = await this.usersService.createUser(createUserDto);
      return {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          isActive: user.is_active
        }
      };
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }
 
  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    this.logger.log('Retrieving all users');
    try {
      const users = await this.usersService.findAll();
      return users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        isActive: user.is_active,
        vehicleCount: user.vehicles?.length || 0,
        journeyCount: user.journeys?.length || 0
      }));
    } catch (error) {
      this.logger.error(`Failed to retrieve users: ${error.message}`);
      throw error;
    }
  }
 
  @Get('profile')
  async getUserProfile(@CurrentUser() user: User) {
    this.logger.log(`Retrieving profile for user: ${user.email}`);
    try {
      const fullProfile = await this.usersService.findById(user.id);
      return {
        id: fullProfile.id,
        email: fullProfile.email,
        firstName: fullProfile.first_name,
        lastName: fullProfile.last_name,
        role: fullProfile.role,
        isActive: fullProfile.is_active,
        vehicles: fullProfile.vehicles,
        journeys: fullProfile.journeys
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve user profile: ${error.message}`);
      throw error;
    }
  }
 
  @Get(':id')
  @Roles(UserRole.ADMIN)
  async getUserById(@Param('id') id: string) {
    this.logger.log(`Retrieving user by ID: ${id}`);
    try {
      const user = await this.usersService.findById(id);
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
        vehicles: user.vehicles,
        journeys: user.journeys
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve user: ${error.message}`);
      throw error;
    }
  }
 
  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User
  ) {
    this.logger.log(`Updating user ID: ${id}`);
    
    // Prevent self-role change
    if (id === currentUser.id && updateUserDto.role) {
      throw new BadRequestException('Cannot change your own role');
    }
 
    try {
      const user = await this.usersService.updateUser(id, updateUserDto);
      return {
        message: 'User updated successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          isActive: user.is_active
        }
      };
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  }
 
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: User
  ) {
    this.logger.log(`Deleting user ID: ${id}`);
    
    // Prevent self-deletion
    if (id === currentUser.id) {
      throw new BadRequestException('Cannot delete your own account');
    }
 
    try {
      await this.usersService.deleteUser(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete user: ${error.message}`);
      throw error;
    }
  }
 
  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  async changeUserStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
    @CurrentUser() currentUser: User
  ) {
    this.logger.log(`Changing status for user ID: ${id} to ${isActive}`);
    
    // Prevent self-deactivation
    if (id === currentUser.id) {
      throw new BadRequestException('Cannot change your own status');
    }
 
    try {
      const user = await this.usersService.changeUserStatus(id, isActive);
      return {
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        user: {
          id: user.id,
          email: user.email,
          isActive: user.is_active
        }
      };
    } catch (error) {
      this.logger.error(`Failed to change user status: ${error.message}`);
      throw error;
    }
  }
 
  @Put(':id/role')
  @Roles(UserRole.ADMIN)
  async changeUserRole(
    @Param('id') id: string,
    @Body('role') newRole: UserRole,
    @CurrentUser() currentUser: User
  ) {
    this.logger.log(`Changing role for user ID: ${id} to ${newRole}`);
    
    // Prevent self-role change
    if (id === currentUser.id) {
      throw new BadRequestException('Cannot change your own role');
    }
 
    try {
      const user = await this.usersService.changeUserRole(id, newRole);
      return {
        message: 'User role changed successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      this.logger.error(`Failed to change user role: ${error.message}`);
      throw error;
    }
  }
 }