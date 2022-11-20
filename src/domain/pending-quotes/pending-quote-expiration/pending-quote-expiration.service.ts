import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { GetPendingQuoteRespDto } from 'src/api/pending-quote-api/dto/get-pending-quote-dto.interface'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { MessageService } from 'src/discord/services/message/message.service'
import { PendingQuoteMessageGeneratorService } from '../services/pending-quote-message-generator/pending-quote-message-generator.service'
import { Cron } from '@nestjs/schedule'
import { Client } from 'discord.js'
@Injectable()
export class PendingQuoteExpirationService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(PendingQuoteExpirationService.name)

  constructor(
    private api: PendingQuoteApiService,
    private msgSvc: MessageService,
    private msgGen: PendingQuoteMessageGeneratorService,
    private client: Client,
  ) {}

  async processExpiration(quote: GetPendingQuoteRespDto) {
    const { LOGGER } = this
    LOGGER.debug(`Handling the expiration of quote ${quote.id}`)

    try {
      await this.api.finalizeStatus({
        quoteId: quote.id,
        status: 'EXPIRED',
      })
      LOGGER.verbose(`Finalized status of quote ${quote.id} as expired`)

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
        `Error encountered while processing the expiration of quote ${quote.id}`,
        e,
      )
    }
  }

  private async doExpiredQuoteSweep(serverId: string) {
    const { LOGGER } = this

    const expiredQuotes = await this.api.getExpiredQuotes({ serverId })
    if (!expiredQuotes?.length) {
      LOGGER.verbose(`No expiring quotes found for ${serverId}`)
      return
    }

    for (const quote of expiredQuotes) {
      try {
        await this.processExpiration(quote)
      } catch (e) {
        LOGGER.error(
          `Uncaught exception while running the expiration process for quote ${quote.id}`,
          e,
        )
      }
    }
  }

  @Cron('0/15 * * * *')
  private async runExpiredQuoteRoutine() {
    const { LOGGER } = this

    LOGGER.log('Running routine for sweeping for expired quotes')
    const guildIds = Array.from(this.client.guilds.cache.keys())
    for (const guildId of guildIds) {
      try {
        await this.doExpiredQuoteSweep(guildId)
      } catch (e) {
        LOGGER.error(`Expired quote sweep failed for server ${guildId}`, e)
      }
    }
    LOGGER.log('Finished the sweep routine')
  }

  onApplicationBootstrap() {
    this.runExpiredQuoteRoutine()
  }
}
