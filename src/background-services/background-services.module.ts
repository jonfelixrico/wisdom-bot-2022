import { Module } from '@nestjs/common'
import { QuoteApprovalWatcherService } from './quote-approval-watcher/quote-approval-watcher.service'

@Module({
  providers: [QuoteApprovalWatcherService],
})
export class BackgroundServicesModule {}
