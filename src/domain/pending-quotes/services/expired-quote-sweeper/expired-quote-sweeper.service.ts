import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Client } from 'discord.js'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { PendingQuoteExpirationService } from '../pending-quote-expiration/pending-quote-expiration.service'

/**
 * This is a background routine service which will check for expired quotes periodically.
 * Found expired quotes will be processed accordingly.
 */
@Injectable()
export class ExpiredQuoteSweeperService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(ExpiredQuoteSweeperService.name)

  constructor(
    private api: PendingQuoteApiService,
    private client: Client,
    private expireSvc: PendingQuoteExpirationService,
  ) {}

  @Cron('0/15 * * * *')
  private async runExpiredQuoteRoutine() {
    const { LOGGER } = this

    LOGGER.log('Running routine for sweeping for expired quotes')
    const guildIds = Array.from(this.client.guilds.cache.keys())
    for (const guildId of guildIds) {
      LOGGER.verbose(`Starting sweep for ${guildId}`)

      try {
        await this.doExpiredQuoteSweep(guildId)
      } catch (e) {
        LOGGER.error(`Expired quote sweep failed for server ${guildId}`, e)
      }

      LOGGER.verbose(`Finished sweep for ${guildId}`)
    }
    LOGGER.log('Finished the sweep routine')
  }

  onApplicationBootstrap() {
    this.runExpiredQuoteRoutine()
  }

  private async doExpiredQuoteSweep(serverId: string) {
    const { LOGGER } = this

    const expiredQuotes = await this.api.getExpiredQuotes({ serverId })
    for (const quote of expiredQuotes) {
      try {
        await this.expireSvc.processExpiration(quote)
      } catch (e) {
        LOGGER.error(
          `Uncaught exception while running the expiration process for quote ${quote.id}`,
          e,
        )
      }
    }
  }
}
