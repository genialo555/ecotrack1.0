// vehicles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './vehicules.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, User])
  ],
  providers: [VehiclesService],
  controllers: [VehiclesController],
  exports: [VehiclesService]
})
export class VehiclesModule {}