import { Module } from '@nestjs/common'
import { ReceiveHandlerService } from './handlers/receive-handler/receive-handler.service'
import { DiscordModule } from 'src/discord/discord.module'
import { AboutHandlerService } from './handlers/about-handler/about-handler.service'
import { SystemModule } from 'src/system/system.module'
import { ApiModule } from 'src/api/api.module'

@Module({
  providers: [ReceiveHandlerService, AboutHandlerService],
  imports: [DiscordModule, SystemModule, ApiModule],
})
export class SlashInteractionsModule {}
