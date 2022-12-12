import { Injectable, Logger } from '@nestjs/common'
import { GetPendingQuoteRespDto } from 'src/api/pending-quote-api/dto/get-pending-quote-dto.interface'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { MessageService } from 'src/discord/services/message/message.service'
import { PendingQuoteMessageGeneratorService } from '../pending-quote-message-generator/pending-quote-message-generator.service'
import { Client, Message } from 'discord.js'
@Injectable()
export class PendingQuoteExpirationService {
  private readonly LOGGER = new Logger(PendingQuoteExpirationService.name)

  constructor(
    private api: PendingQuoteApiService,
    private msgSvc: MessageService,
    private msgGen: PendingQuoteMessageGeneratorService,
    private client: Client,
  ) {}

  private async finalizeAsExpired({ id }: GetPendingQuoteRespDto) {
    await this.api.finalizeStatus({
      quoteId: id,
      status: 'EXPIRED',
    })
  }

  private async finalizeAsExpiredAndNotify(quote: GetPendingQuoteRespDto) {
    const { LOGGER } = this
    let message: Message
    try {
      message = await this.msgSvc.getMessage(quote)
    } catch (e) {
      LOGGER.warn(
        `Encountered error when trying to retrieve message for quote ${quote.id} from  ${quote.serverId}/${quote.channelId}. Process will carry on.`,
        e,
      )
    }

    await this.finalizeAsExpired(quote)
    LOGGER.verbose(`Flagged ${quote.id} as expired.`)

    if (message) {
      try {
        await message.edit(
          await this.msgGen.generateForExpiration({
            ...quote,
            year: new Date(quote.submitDt).getFullYear(),
          }),
        )
        LOGGER.debug(
          `Sent notification that quote ${quote.id} has expired to ${quote.serverId}/${quote.channelId}`,
        )
      } catch (e) {
        LOGGER.warn(
          `Failed to send notification that quote ${quote.id} is expired to ${quote.serverId}/${quote.channelId}`,
        )
      }
    }
  }

  async processExpiration(quote: GetPendingQuoteRespDto) {
    const { LOGGER } = this
    LOGGER.debug(`Handling the expiration of quote ${quote.id}`)

    try {
      if (!quote.messageId || !quote.channelId) {
        await this.finalizeAsExpired(quote)
        LOGGER.verbose(
          `Flagged ${quote.id} as expired w/o message notifications.`,
        )
        return
      }

      await this.finalizeAsExpiredAndNotify(quote)
    } catch (e) {
      LOGGER.error(
        `Error encountered while processing the expiration of quote ${quote.id}`,
        e,
      )
    }
  }
}
