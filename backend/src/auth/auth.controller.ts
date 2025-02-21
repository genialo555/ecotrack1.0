/* eslint-disable prettier/prettier */
// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UnauthorizedException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  Logger,
  Request,
  BadRequestException
} from '@nestjs/common';

import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/roles.enum';
import { LocalAuthGuard } from './local-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(ThrottlerGuard)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();

  constructor(private readonly authService: AuthService) {}

  private validateLoginAttempts(email: string): void {
    const now = new Date();
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: now };
    
    // Reset attempts if last attempt was more than 15 minutes ago
    if ((now.getTime() - attempts.lastAttempt.getTime()) > 15 * 60 * 1000) {
      attempts.count = 0;
    }
    
    if (attempts.count >= 5) {
      throw new UnauthorizedException('Too many login attempts. Please try again later.');
    }
    
    attempts.count++;
    attempts.lastAttempt = now;
    this.loginAttempts.set(email, attempts);
  }

  private validateGeolocation(latitude?: number, longitude?: number): void {
    if (latitude !== undefined && longitude !== undefined) {
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        throw new BadRequestException('Invalid geolocation coordinates');
      }
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      this.logger.debug('Login request received:', {
        email: loginDto.email,
        hasPassword: !!loginDto.password
      });
      
      // Validate login attempts
      this.validateLoginAttempts(loginDto.email);
      
      // Validate geolocation if provided
      this.validateGeolocation(loginDto.latitude, loginDto.longitude);

      // Sanitize email
      const sanitizedEmail = loginDto.email.toLowerCase().trim();
      
      this.logger.debug(`Attempting login for: ${sanitizedEmail}`);
      const user = await this.authService.validateUser(
        sanitizedEmail,
        loginDto.password,
      );

      const locationData = loginDto.latitude && loginDto.longitude
        ? { 
            latitude: parseFloat(loginDto.latitude.toFixed(6)), 
            longitude: parseFloat(loginDto.longitude.toFixed(6)) 
          }
        : undefined;

      const result = await this.authService.login(user, locationData);

      // Set secure cookie
      response.cookie('token', result.access_token, {
        httpOnly: true, // Prevent XSS
        secure: true, // Only send over HTTPS
        sameSite: 'strict', // Prevent CSRF
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Reset login attempts on successful login
      this.loginAttempts.delete(sanitizedEmail);

      return {
        message: 'Connexion réussie',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      this.logger.error(`Échec de connexion pour ${loginDto.email}:`, error.message);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/'
    });
    
    return { success: true, message: 'Déconnexion réussie' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
    };
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validateToken(@CurrentUser() user: User) {
    return {
      isValid: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAuthenticatedUsers() {
    this.logger.debug('Accès à la liste des utilisateurs (ADMIN)');
    return {
      message: 'Admin only route',
    };
  }
}