import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controllers'; // Import du contrôleur
import { UsersService } from './user.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], // Déclare le contrôleur ici
  providers: [UsersService],
  exports: [UsersService], // Exporte le service si utilisé dans d'autres modules
})
export class UsersModule {}
