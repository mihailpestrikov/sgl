import { Module } from '@nestjs/common';
import { CommonDataService } from './common-data.service';

@Module({
  providers: [CommonDataService],
  exports: [CommonDataService]
})
export class CommonModule {}