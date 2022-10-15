import { Module } from '@nestjs/common'
import { QuoteApprovePresentationService } from './quote-approve-presentation/quote-approve-presentation.service'
import { QuoteSubmitPresentationService } from './quote-submit-presentation/quote-submit-presentation.service'
import { UserAvatarService } from './user-avatar/user-avatar.service'

@Module({
  providers: [
    QuoteApprovePresentationService,
    QuoteSubmitPresentationService,
    UserAvatarService,
  ],
})
export class PresentationModule {}
