// vehicles.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Delete,
  Patch,
  NotFoundException,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './update-vehicule.dto';
import { UserRole } from '../users/roles.enum';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Request() req, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(req.user.id, dto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.vehiclesService.findByUserId(userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.vehiclesService.findAll();
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateVehicleDto
  ) {
    return this.vehiclesService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.remove(id);
  }
}