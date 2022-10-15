import { Module } from '@nestjs/common'
import { EventListenersModule } from 'src/event-listeners/event-listeners.module'
import { QuoteApprovalWatcherService } from './quote-approval-watcher/quote-approval-watcher.service'

@Module({
  providers: [QuoteApprovalWatcherService],
  imports: [EventListenersModule],
})
export class BackgroundServicesModule {}
