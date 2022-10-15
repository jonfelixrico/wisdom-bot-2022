import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { Client, MessageReaction } from 'discord.js'
import * as LRU from 'lru-cache'
import { concatMap, from, groupBy, mergeMap } from 'rxjs'
import { sprintf } from 'sprintf-js'
import { GetPendingQuoteByMessageIdRes } from 'src/api/pending-quote-api/model/get-pending-quote-by-message-id.dto'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { ReactionChangesObservable } from 'src/discord/reaction-changes-observable'

@Injectable()
export class QuoteApprovalWatcherService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(QuoteApprovalWatcherService.name)

  private cache: LRU<string, GetPendingQuoteByMessageIdRes>

  constructor(
    private obs: ReactionChangesObservable,
    private api: PendingQuoteApiService,
    private client: Client,
  ) {
    this.cache = new LRU({
      noDeleteOnFetchRejection: true,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
      ttlAutopurge: true,
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
    const { LOGGER } = this

    const serverId = emit.message.guildId

    const quote = await this.cache.fetch(`${serverId}/${emit.message.id}`)

    const filtered = Array.from(
      emit.users.cache
        .filter((user) => !user.equals(this.client.user))
        .values(),
    )

    if (
      emit.emoji.name !== '👍' || // TODO remove hardcoded value since this can change per server
      filtered.length < quote.requiredVoteCount
    ) {
      return
    }
    LOGGER.debug(
      sprintf(
        'Sufficient reacts detected for quote %s; proceeding with approval',
        quote.id,
      ),
    )

    try {
      await Promise.all(
        filtered.map((user) => {
          return this.api.addVote({
            serverId,
            quoteId: quote.id,
            userId: user.id,
          })
        }),
      )
    } catch (e) {
      LOGGER.error(
        sprintf('Error encountered while pushing votes for quote %s', quote.id),
        e,
      )
      return
    }

    try {
      await this.api.finalizeStatus({
        quoteId: quote.id,
        serverId,
      })
    } catch (e) {
      LOGGER.error(
        sprintf(
          'Error encountered while approving the status for quote %s',
          quote.id,
        ),
        e,
      )
    }

    LOGGER.log(sprintf('Approved quote %s', quote.id))
  }

  onApplicationBootstrap() {
    this.obs
      .pipe(
        // group messages into their own streams
        groupBy((reaction) => reaction.message.id),
        mergeMap((group$) => {
          // in individual streams, execute the handler one by one
          return group$.pipe(
            concatMap((reaction) => from(this.handler(reaction))),
          )
        }),
      )
      .subscribe()
    this.LOGGER.log('Now watching for quote approvals...')
  }
}
