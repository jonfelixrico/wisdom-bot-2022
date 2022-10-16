import { Injectable, Logger } from '@nestjs/common'
import { GetPendingQuoteRespDto } from 'src/api/pending-quote-api/dto/get-pending-quote-dto.interface'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { MessageService } from 'src/discord/services/message/message.service'
import { PendingQuoteMessageGeneratorService } from '../services/pending-quote-message-generator/pending-quote-message-generator.service'

@Injectable()
export class PendingQuoteExpirationService {
  private readonly LOGGER = new Logger(PendingQuoteExpirationService.name)

  constructor(
    private api: PendingQuoteApiService,
    private msgSvc: MessageService,
    private msgGen: PendingQuoteMessageGeneratorService,
  ) {}

  async processExpiration(quote: GetPendingQuoteRespDto) {
    const { LOGGER } = this
    LOGGER.debug(`Handling the expiration of quote ${quote.id}`)

    try {
      await this.api.finalizeStatus({
        quoteId: quote.id,
        status: 'EXPIRED',
      })
      LOGGER.debug(`Finalized status of quote ${quote.id} as expired`)

      const message = await this.msgSvc.getMessage(quote)
      await message.edit(
        await this.msgGen.generateForExpiration({
          ...quote,
          year: new Date(quote.submitDt).getFullYear(),
        }),
      )

      await message.channel.send({
        reply: {
          messageReference: message,
        },
        content:
          'This quote failed to reach the required number of upvotes before the deadline',
      })
    } catch (e) {
      LOGGER.error(
        `Error encountered while processing the approval of quote ${quote.id}`,
        e,
      )
    }
  }
}
