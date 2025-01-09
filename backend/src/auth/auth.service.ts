// auth.service.ts

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { User } from '../users/user.entity';
import { JwtPayload } from './auth.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Permet de valider les identifiants fournis lors de la tentative de connexion.
   * - Récupère l'utilisateur par son email dans la BDD
   * - Vérifie que l'utilisateur est actif
   * - Compare le mot de passe fourni avec le hash stocké
   * - Retourne l'utilisateur (sans le hash) si tout est correct
   */
  async validateUser(email: string, password: string): Promise<any> {
    this.logger.debug('=== Authentication Attempt ===');
    this.logger.debug(`Login attempt for email: ${email}`);

    try {
      // Rechercher l'utilisateur en base
      const user = await this.usersService.findByEmail(email);
      this.logger.debug(`User found: ${user ? 'yes' : 'no'}`);

      // Utilisateur non trouvé
      if (!user) {
        this.logger.debug('Authentication failed: User not found');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Vérifier que l'utilisateur est actif
      if (!user.is_active) {
        this.logger.debug('Authentication failed: User is not active');
        throw new UnauthorizedException('Account is not active');
      }

      // Comparer le mot de passe fourni avec le hash stocké en BDD
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      this.logger.debug(`Password validation result: ${isPasswordValid}`);

      if (!isPasswordValid) {
        this.logger.debug('Authentication failed: Invalid password');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Retirer le hash du résultat avant de renvoyer l'objet user
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...result } = user;
      this.logger.debug('Authentication successful');
      return result;
    } catch (error) {
      this.logger.error(`Authentication error: ${error.message}`);
      // On relance l’exception pour que Nest gère la réponse HTTP 401
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Permet de générer un token JWT à partir d'un utilisateur validé.
   */
  async login(user: User) {
    this.logger.debug(`Generating token for user: ${user.email}`);
    try {
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      // Générer le token via le JwtService
      const token = this.jwtService.sign(payload);
      this.logger.debug('Token generated successfully');

      // Retourner le token et les infos utiles de l’utilisateur
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          isActive: user.is_active,
        },
      };
    } catch (error) {
      this.logger.error(`Error generating token: ${error.message}`);
      throw new UnauthorizedException('Error during login process');
    }
  }

  /**
   * Valide un token JWT et retourne l’utilisateur correspondant si tout est correct.
   */
  async validateToken(token: string): Promise<User> {
    this.logger.debug('Validating token');
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);

      if (!user || !user.is_active) {
        this.logger.debug(
          'Token validation failed: User not found or inactive',
        );
        throw new UnauthorizedException('Invalid token');
      }

      this.logger.debug('Token validated successfully');
      return user;
    } catch (error) {
      this.logger.error(`Token validation error: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Méthode de test pour générer un hash à partir d'un mot de passe en clair.
   * Vous pouvez l'appeler manuellement (ex. via un endpoint) pour créer un hash.
   */
  async generateTestHash() {
    const testPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(testPassword, salt);
    this.logger.debug(`Generated test hash for ${testPassword}: ${hash}`);
    return hash;
  }
}
