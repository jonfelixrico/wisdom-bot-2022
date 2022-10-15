import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { QuoteApprovalWatcherService } from './quote-approval-watcher/quote-approval-watcher.service'
import { MessageIdStartupWhitelisterService } from './message-id-startup-whitelister/message-id-startup-whitelister.service'

@Module({
  providers: [QuoteApprovalWatcherService, MessageIdStartupWhitelisterService],
  imports: [DiscordModule],
})
export class BackgroundServicesModule {}
