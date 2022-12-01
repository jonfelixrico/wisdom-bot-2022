import { Module } from '@nestjs/common'
import { BotInfoService } from './bot-info/bot-info.service'
import { ServerInfoService } from './server-info/server-info.service'

@Module({
  providers: [BotInfoService, ServerInfoService],
  exports: [BotInfoService, ServerInfoService],
})
export class SystemModule {}
