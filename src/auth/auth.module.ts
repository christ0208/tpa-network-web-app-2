import { Module } from '@nestjs/common';
import { LogHistoriesService } from 'src/log-histories/log-histories.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LogHistoriesService]
})
export class AuthModule {}
