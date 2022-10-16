import { Injectable, Logger } from '@nestjs/common'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { MessageService } from 'src/discord/services/message/message.service'
import { PendingQuoteMessageGeneratorService } from '../services/pending-quote-message-generator/pending-quote-message-generator.service'

@Injectable()
export class PendingQuoteApprovalService {
  private readonly LOGGER = new Logger(PendingQuoteApprovalService.name)

  constructor(
    private api: PendingQuoteApiService,
    private msgSvc: MessageService,
    private msgGen: PendingQuoteMessageGeneratorService,
  ) {}

  async processApproval(quoteId: string) {
    const { LOGGER } = this
    LOGGER.debug(`Handling the approval of quote ${quoteId}`)

    try {
      const quote = await this.api.get({ quoteId })
      const message = await this.msgSvc.getMessage(quote)

      await this.api.finalizeStatus({
        quoteId: quote.id,
        status: 'APPROVED',
      })
      LOGGER.debug(`Finalized status of quote ${quote.id} as approved`)

      await message.edit(
        await this.msgGen.generateForApproval({
          ...quote,
          year: new Date(quote.submitDt).getFullYear(),
        }),
      )

      await message.channel.send({
        reply: {
          messageReference: message,
        },
        content: 'This quote has been approved 🎊🎉',
      })
    } catch (e) {
      LOGGER.error(
        `Error encountered while processing the approval of quote ${quoteId}`,
        e,
      )
    }
  }
}
