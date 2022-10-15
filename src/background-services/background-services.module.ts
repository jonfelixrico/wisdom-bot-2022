import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { QuoteApprovalWatcherService } from './quote-approval-watcher/quote-approval-watcher.service'
import { MessageIdStartupWhitelisterService } from './message-id-startup-whitelister/message-id-startup-whitelister.service'
import { ApiModule } from 'src/api/api.module'

@Module({
  providers: [QuoteApprovalWatcherService, MessageIdStartupWhitelisterService],
  imports: [DiscordModule, ApiModule],
})
export class BackgroundServicesModule {}
