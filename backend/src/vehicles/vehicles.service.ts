import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicules.dto';
import { UpdateVehicleDto } from './dto/update-vehicule.dto';
import { User } from '../users/user.entity';
import { ActivityService } from '../activity/activity.service';
import { ActivityType, ActivityAction } from '../activity/activity.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly activityService: ActivityService
  ) {}

  async create(createVehicleDto: CreateVehicleDto, user: User): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      user,
      user_id: user.id,
      is_active: true
    });

    const savedVehicle = await this.vehicleRepository.save(vehicle);

    await this.activityService.logActivity(
      ActivityType.VEHICLE,
      ActivityAction.CREATE,
      { vehicleId: savedVehicle.id, ...createVehicleDto },
      user
    );

    return savedVehicle;
  }

  async findAll(userId: string): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto, user: User): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    Object.assign(vehicle, updateVehicleDto);
    const updatedVehicle = await this.vehicleRepository.save(vehicle);

    await this.activityService.logActivity(
      ActivityType.VEHICLE,
      ActivityAction.UPDATE,
      { vehicleId: id, ...updateVehicleDto },
      user
    );

    return updatedVehicle;
  }

  async remove(id: string, user: User): Promise<void> {
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    await this.vehicleRepository.remove(vehicle);

    await this.activityService.logActivity(
      ActivityType.VEHICLE,
      ActivityAction.DELETE,
      { vehicleId: id },
      user
    );
  }
}
