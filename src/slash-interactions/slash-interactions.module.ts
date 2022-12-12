import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { AboutHandlerService } from './handlers/about-handler/about-handler.service'
import { SystemModule } from 'src/system/system.module'
import { ApiModule } from 'src/api/api.module'

@Module({
  providers: [AboutHandlerService],
  imports: [DiscordModule, SystemModule, ApiModule],
})
export class SlashInteractionsModule {}
