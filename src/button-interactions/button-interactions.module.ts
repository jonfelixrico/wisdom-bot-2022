import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { UpvoteHandlerService } from './handlers/upvote-handler/upvote-handler.service'

@Module({
  providers: [UpvoteHandlerService],
  imports: [DiscordModule],
})
export class ButtonInteractionsModule {}
