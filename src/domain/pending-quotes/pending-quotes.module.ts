import { Module } from '@nestjs/common'
import { ApiModule } from 'src/api/api.module'
import { DiscordModule } from 'src/discord/discord.module'
import { UpvoteHandlerService } from './button-interactions/upvote-handler/upvote-handler.service'
import { SubmitHandlerService } from './slash-interactions/submit-handler/submit-handler.service'
import { PendingQuoteDownstreamService } from './services/pending-quote-downstream/pending-quote-downstream.service'
import { PendingQuoteMessageGeneratorService } from './services/pending-quote-message-generator/pending-quote-message-generator.service'
import { PendingQuoteExpirationService } from './services/pending-quote-expiration/pending-quote-expiration.service'
import { PendingQuoteApprovalService } from './services/pending-quote-approval/pending-quote-approval.service'
import { ExpiredQuoteSweeperService } from './services/expired-quote-sweeper/expired-quote-sweeper.service'

@Module({
  providers: [
    UpvoteHandlerService,
    SubmitHandlerService,
    PendingQuoteDownstreamService,
    PendingQuoteMessageGeneratorService,
    PendingQuoteExpirationService,
    PendingQuoteApprovalService,
    ExpiredQuoteSweeperService,
  ],
  imports: [DiscordModule, ApiModule],
})
export class PendingQuotesModule {}
