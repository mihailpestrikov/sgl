import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService]
})
export class HomeModule {}