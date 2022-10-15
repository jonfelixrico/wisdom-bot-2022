import { Module } from '@nestjs/common'
import { UpvoteHandlerService } from './handlers/upvote-handler/upvote-handler.service'

@Module({
  providers: [UpvoteHandlerService],
})
export class ButtonInteractionsModule {}
