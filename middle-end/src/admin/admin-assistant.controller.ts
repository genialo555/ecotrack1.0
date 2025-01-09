import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Query,
  UseGuards,
  Request,
  UnauthorizedException
} from '@nestjs/common';
import { AdminAssistantService } from './admin-assistant.service ';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminRequestDTO, AdminHistoryDTO } from '../gemini/types/admin.types';

@Controller('admin/assistant')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminAssistantController {
  constructor(private readonly adminAssistantService: AdminAssistantService) {}

  @Post('execute')
  async executeAction(
    @Request() req,
    @Body() dto: AdminRequestDTO
  ) {
    if (!req.user?.adminId) {
      throw new UnauthorizedException('Admin ID required');
    }

    return this.adminAssistantService.processAdminRequest(
      req.user.adminId,
      dto.action,
      dto.parameters
    );
  }

  @Get('history')
  async getHistory(
    @Request() req,
    @Query() query: AdminHistoryDTO
  ) {
    return this.adminAssistantService.getAdminHistory(req.user.adminId);
  }

  @Post('analyze')
  async analyzeData(
    @Request() req,
    @Body() data: any
  ) {
    return this.adminAssistantService.processAdminRequest(
      req.user.adminId,
      'ANALYZE_DATA',
      data
    );
  }

  @Post('suggest')
  async getSuggestions(
    @Request() req,
    @Body() context: any
  ) {
    return this.adminAssistantService.processAdminRequest(
      req.user.adminId,
      'GET_SUGGESTIONS',
      context
    );
  }
}