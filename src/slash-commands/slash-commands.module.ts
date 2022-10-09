import { Module } from '@nestjs/common'
import { SubmitHandlerService } from './handlers/submit-handler/submit-handler.service'
import { ReceiveHandlerService } from './handlers/receive-handler/receive-handler.service'

@Module({
  providers: [SubmitHandlerService, ReceiveHandlerService],
})
export class SlashCommandsModule {}
