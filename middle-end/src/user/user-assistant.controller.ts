// src/user/user-assistant.controller.ts
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserAssistantService } from './user-assistant.service';

@Controller('user/assistant')
@UseGuards(JwtAuthGuard)
export class UserAssistantController {
  constructor(private readonly assistantService: UserAssistantService) {}

  @Post('journey/optimize')
  async optimizeJourney(@Request() req, @Body() journeyData: any) {
    return this.assistantService.optimizeJourney(req.user.id, journeyData);
  }

  @Post('co2/analyze')
  async analyzeCO2Impact(@Request() req, @Body() data: any) {
    return this.assistantService.analyzeCO2Impact(req.user.id, data);
  }

  @Get('suggestions')
  async getPersonalizedSuggestions(@Request() req) {
    return this.assistantService.getPersonalizedSuggestions(req.user.id);
  }

  @Post('help')
  async getHelp(@Request() req, @Body() question: any) {
    return this.assistantService.provideAssistance(req.user.id, question);
  }
}