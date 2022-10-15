import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { Client, MessageReaction } from 'discord.js'
import LRUCache from 'lru-cache'
import { GetPendingQuoteByMessageIdRes } from 'src/api/pending-quote-api/model/get-pending-quote-by-message-id.dto'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { ReactionChangesObservable } from 'src/discord/reaction-changes-observable'

@Injectable()
export class QuoteApprovalWatcherService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(QuoteApprovalWatcherService.name)

  private cache: LRUCache<string, GetPendingQuoteByMessageIdRes>

  constructor(
    private obs: ReactionChangesObservable,
    private api: PendingQuoteApiService,
    private client: Client,
  ) {
    this.cache = new LRUCache({
      noDeleteOnFetchRejection: true,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
      ttl: 60 * 1000,
      fetchMethod: async (key) => {
        const [serverId, messageId] = key.split('/')
        try {
          return await this.api.getPendingQuoteByMessageId({
            serverId,
            messageId,
          })
        } catch (e) {
          this.LOGGER.error('Error encountered while trying to fetch value', e)
          throw e
        }
      },
    })
  }

  private async handler(emit: MessageReaction) {
    const serverId = emit.message.guildId
    const quote = await this.cache.fetch([serverId, emit.message.id].join('/'))

    const filtered = Array.from(
      emit.users.cache
        .filter((user) => !user.equals(this.client.user))
        .values(),
    )

    if (filtered.length < quote.requiredVoteCount) {
      return
    }

    await Promise.all(
      filtered.map((user) => {
        return this.api.addVote({
          serverId,
          quoteId: quote.id,
          userId: user.id,
        })
      }),
    )

    await this.api.finalizeStatus({
      quoteId: quote.id,
      serverId,
    })
  }

  onApplicationBootstrap() {
    this.obs.subscribe(this.handler.bind(this))
    this.LOGGER.log('Now watching for quote approvals...')
  }
}
