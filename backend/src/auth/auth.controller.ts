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
  Logger
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
 
 @Controller('auth')
 @UseInterceptors(ClassSerializerInterceptor)
 export class AuthController {
  private readonly logger = new Logger(AuthController.name);
 
  constructor(private readonly authService: AuthService) {}
 
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      // Validation de l'utilisateur
      this.logger.debug(`Tentative de connexion pour: ${loginDto.email}`);
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
 
      // Génération du token et infos utilisateur
      const result = await this.authService.login(user);
      this.logger.debug(`Connexion réussie pour: ${loginDto.email}`);
 
      // Configuration du cookie avec le token JWT
      response.cookie('token', result.access_token, {
        httpOnly: false, // Permet l'accès via JavaScript pour le middleware frontend
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });
 
      this.logger.debug(`Cookie 'token' défini pour: ${loginDto.email}`);
      
      return {
        ...result,
        message: 'Connexion réussie'
      };
    } catch (error) {
      this.logger.error(`Échec de connexion pour ${loginDto.email}:`, error.message);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
 
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // Suppression du cookie avec les mêmes paramètres que lors de sa création
    response.clearCookie('token', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    this.logger.debug('Déconnexion réussie - Cookie supprimé');
    return { success: true, message: 'Déconnexion réussie' };
  }
 
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    this.logger.debug(`Récupération du profil pour: ${user.email}`);
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
    this.logger.debug(`Validation du token pour: ${user.email}`);
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