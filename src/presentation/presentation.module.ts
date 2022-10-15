import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { UserAvatarService } from './user-avatar/user-avatar.service'
import { PendingQuotePresentationService } from './pending-quote-presentation/pending-quote-presentation.service'

@Module({
  providers: [UserAvatarService, PendingQuotePresentationService],
  imports: [DiscordModule],
  exports: [PendingQuotePresentationService],
})
export class PresentationModule {}
