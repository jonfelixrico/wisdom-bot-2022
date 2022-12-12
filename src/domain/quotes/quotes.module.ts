import { Module } from '@nestjs/common'
import { ApiModule } from 'src/api/api.module'
import { DiscordModule } from 'src/discord/discord.module'
import { ReceiveHandlerService } from './slash-interactions/receive-handler/receive-handler.service'

@Module({
  providers: [ReceiveHandlerService],
  imports: [DiscordModule, ApiModule],
})
export class QuotesModule {}
