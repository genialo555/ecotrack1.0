/* eslint-disable prettier/prettier */
// src/journeys/journeys.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Delete,
  Patch,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateJourneyDto } from './create-journey.dto';
import { UpdateJourneyDto } from './update-journey.dto';
import { UserRole } from '../users/roles.enum';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { JourneysService } from './journeys.service';

@Controller('journeys')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class JourneysController {
  constructor(private readonly journeysService: JourneysService) {}

  @Post()
  async createJourney(
    @Body() dto: CreateJourneyDto,
    @CurrentUser() user: User
  ) {
    console.log('Received journey creation request:', {
      dto,
      userId: user.id,
      userRole: user.role
    });

    if (user.role !== UserRole.ADMIN) {
      dto.userId = user.id;
    }

    try {
      const journey = await this.journeysService.createJourney(dto);
      console.log('Journey created successfully:', journey);
      return journey;
    } catch (error) {
      console.error('Error creating journey:', error);
      throw error;
    }
  }

  @Get(':id')
  async getJourney(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ) {
    const journey = await this.journeysService.findById(id);
    if (user.role !== UserRole.ADMIN && journey.user.id !== user.id) {
      throw new ForbiddenException('You can only access your own journeys');
    }
    return journey;
  }

  @Get()
  async getAllJourneys(
    @CurrentUser() user: User
  ) {
    if (user.role === UserRole.ADMIN) {
      return this.journeysService.findAll();
    }
    return this.journeysService.findByUser(user.id);
  }

  @Patch(':id')
  async updateJourney(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateJourneyDto,
    @CurrentUser() user: User
  ) {
    const journey = await this.journeysService.findById(id);
    if (user.role !== UserRole.ADMIN && journey.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own journeys');
    }
    return this.journeysService.updateJourney(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteJourney(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.journeysService.deleteJourney(id);
  }

  @Post('distance')
  async calculateDistance(
    @Body() data: { origin: string; destination: string }
  ) {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        data.origin
      )}&destinations=${encodeURIComponent(
        data.destination
      )}&mode=driving&units=metric&key=${process.env.GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.status === 'OK' && result.rows[0]?.elements[0]?.status === 'OK') {
        return {
          distance: result.rows[0].elements[0].distance.value / 1000, // Convert to kilometers
          duration: result.rows[0].elements[0].duration.value / 60, // Convert to minutes
          originAddress: result.origin_addresses[0],
          destinationAddress: result.destination_addresses[0]
        };
      }

      throw new Error(result.error_message || 'Failed to calculate distance');
    } catch (error) {
      throw new BadRequestException(error.message || 'Error calculating distance');
    }
  }
}