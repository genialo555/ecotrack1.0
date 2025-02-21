/* eslint-disable prettier/prettier */
// src/journeys/journeys.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  ForbiddenException,
  Logger,
  BadRequestException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { UserRole } from '../users/roles.enum';
import { JourneysService } from './journeys.service';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { validate } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

@Controller('journeys')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class JourneysController {
  private readonly logger = new Logger(JourneysController.name);

  constructor(private readonly journeysService: JourneysService) {}

  private sanitizeInput(input: string): string {
    return sanitizeHtml(input.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  private validateCoordinates(lat?: number, lon?: number): void {
    if (lat !== undefined && (lat < -90 || lat > 90)) {
      throw new BadRequestException('Invalid latitude value');
    }
    if (lon !== undefined && (lon < -180 || lon > 180)) {
      throw new BadRequestException('Invalid longitude value');
    }
  }

  @Post()
  async createJourney(
    @Body() dto: CreateJourneyDto,
    @CurrentUser() user: User
  ) {
    // Validate DTO
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid journey data');
    }

    // Sanitize text inputs
    if (dto.description) {
      dto.description = this.sanitizeInput(dto.description);
    }
    if (dto.title) {
      dto.title = this.sanitizeInput(dto.title);
    }

    // Validate coordinates if present
    if (dto.startLatitude || dto.startLongitude) {
      this.validateCoordinates(dto.startLatitude, dto.startLongitude);
    }
    if (dto.endLatitude || dto.endLongitude) {
      this.validateCoordinates(dto.endLatitude, dto.endLongitude);
    }

    // Set user ID for non-admin users
    if (user.role !== UserRole.ADMIN) {
      dto.userId = user.id;
    }

    try {
      const journey = await this.journeysService.createJourney(dto);
      this.logger.log(`Journey created successfully: ${journey.id}`);
      return journey;
    } catch (error) {
      this.logger.error('Error creating journey', { error: error.message });
      throw error;
    }
  }

  @Get(':id')
  async getJourney(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ) {
    const journey = await this.journeysService.findById(id);
    
    // Check user permissions
    if (user.role !== UserRole.ADMIN && journey.user.id !== user.id) {
      this.logger.warn(`Unauthorized journey access attempt: ${id}`);
      throw new ForbiddenException('You can only access your own journeys');
    }

    // Remove sensitive data
    const { user: journeyUser, ...journeyData } = journey;
    return {
      ...journeyData,
      user: {
        id: journeyUser.id,
        email: journeyUser.email
      }
    };
  }

  @Get()
  async getAllJourneys(
    @CurrentUser() user: User
  ) {
    try {
      const journeys = user.role === UserRole.ADMIN
        ? await this.journeysService.findAll()
        : await this.journeysService.findByUser(user.id);

      // Remove sensitive data from response
      return journeys.map(journey => {
        const { user: journeyUser, ...journeyData } = journey;
        return {
          ...journeyData,
          user: {
            id: journeyUser.id,
            email: journeyUser.email
          }
        };
      });
    } catch (error) {
      this.logger.error('Error fetching journeys', { error: error.message });
      throw error;
    }
  }
}