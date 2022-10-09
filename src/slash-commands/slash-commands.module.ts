import { Module } from '@nestjs/common'
import { SubmitHandlerService } from './handlers/submit-handler/submit-handler.service'
import { ReceiveHandlerService } from './handlers/receive-handler/receive-handler.service'
import { DiscordModule } from 'src/discord/discord.module'

@Module({
  providers: [SubmitHandlerService, ReceiveHandlerService],
  imports: [DiscordModule],
})
export class SlashCommandsModule {}
