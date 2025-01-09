import { Module } from '@nestjs/common';
import { BackendService } from './backend.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BackendService],
  exports: [BackendService]
})
export class BackendModule {}

