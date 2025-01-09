import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicules.entity';
import { User } from '../users/user.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './update-vehicule.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: string, createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create vehicle with relation
    const vehicle = this.vehicleRepo.create({
      ...createVehicleDto,
      user,
      is_active: true,
    });

    return this.vehicleRepo.save(vehicle);
  }

  async findById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  async findByUserId(userId: string): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      relations: ['user'],
    });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findById(id);
    Object.assign(vehicle, updateVehicleDto);
    return this.vehicleRepo.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findById(id);
    await this.vehicleRepo.remove(vehicle);
  }
}
