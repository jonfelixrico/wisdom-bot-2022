import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { Client } from 'discord.js'
import { sprintf } from 'sprintf-js'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { MessageIdWhitelist } from 'src/discord/message-id-whitelist.abstract'

@Injectable()
export class MessageIdStartupWhitelisterService
  implements OnApplicationBootstrap
{
  private readonly LOGGER = new Logger(MessageIdStartupWhitelisterService.name)

  constructor(
    private api: PendingQuoteApiService,
    private client: Client,
    private whitelist: MessageIdWhitelist,
  ) {}

  private async retrieveByGuild(guildId: string) {
    const { LOGGER } = this

    try {
      const messageIds = await this.api.getPendingQuoteMessageIds(guildId)
      for (const messageId of messageIds) {
        await this.whitelist.add(messageId)
      }

      LOGGER.debug(
        sprintf(
          'Saved %d message ids for guild %s',
          messageIds.length,
          guildId,
        ),
      )
    } catch (e) {
      LOGGER.error(
        sprintf(
          'Encountered an error while getting pending quote message ids for server %s',
          guildId,
        ),
        e,
      )
    }
  }

  async onApplicationBootstrap() {
    const { LOGGER } = this

    const guildIds = Array.from(this.client.guilds.cache.keys())
    LOGGER.log(
      sprintf(
        'Whitelisting pending quote message ids for %d servers',
        guildIds.length,
      ),
    )

    for (const guildId of guildIds) {
      LOGGER.debug(
        sprintf('Retrieving pending quote message ids for server %s', guildId),
      )

      this.retrieveByGuild(guildId)
    }

    LOGGER.log('Finished whitelisting pending quote message ids')
  }
}
