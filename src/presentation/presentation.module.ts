import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { QuoteSubmitPresentationService } from './quote-submit-presentation/quote-submit-presentation.service'
import { UserAvatarService } from './user-avatar/user-avatar.service'

@Module({
  providers: [QuoteSubmitPresentationService, UserAvatarService],
  imports: [DiscordModule],
})
export class PresentationModule {}
