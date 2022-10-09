import { Module } from '@nestjs/common'
import { AppInfoService } from './app-info/app-info.service'

@Module({
  providers: [AppInfoService],
  exports: [AppInfoService],
})
export class SystemModule {}
