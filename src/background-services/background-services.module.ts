import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { QuoteApprovalWatcherService } from './quote-approval-watcher/quote-approval-watcher.service'

@Module({
  providers: [QuoteApprovalWatcherService],
  imports: [DiscordModule],
})
export class BackgroundServicesModule {}
