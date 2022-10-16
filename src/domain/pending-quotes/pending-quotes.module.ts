import { Module } from '@nestjs/common'
import { ApiModule } from 'src/api/api.module'
import { DiscordModule } from 'src/discord/discord.module'
import { UpvoteHandlerService } from './button-interactions/upvote-handler/upvote-handler.service'
import { SubmitHandlerService } from './slash-interactions/submit-handler/submit-handler.service'

@Module({
  providers: [UpvoteHandlerService, SubmitHandlerService],
  imports: [DiscordModule, ApiModule],
})
export class PendingQuotesModule {}
