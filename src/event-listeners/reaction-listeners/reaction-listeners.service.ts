import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { Client, PartialMessageReaction, User } from 'discord.js'
import { debounceTime, groupBy, mergeMap, Observable, Subject } from 'rxjs'
import { sprintf } from 'sprintf-js'

function debounceEmitsByMessageId(
  subject: Subject<PartialMessageReaction>,
): Observable<PartialMessageReaction> {
  subject.pipe(
    groupBy((reaction) => reaction.message.id),
    mergeMap((grouped) => {
      return grouped.pipe(debounceTime(2000))
    }),
  )
  return null
}

/**
 * The only concern of this service is to listen for reaction-related events and to just
 * re-emit them.
 */
@Injectable()
export class ReactionListenersService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(ReactionListenersService.name)

  private subject: Subject<PartialMessageReaction>
  private observable: Observable<PartialMessageReaction>

  constructor(private client: Client) {
    this.subject = new Subject()
    this.observable = debounceEmitsByMessageId(this.subject)
  }

  get reactionChanges$() {
    return this.observable
  }

  private handleReactionChanges(reaction: PartialMessageReaction) {
    this.subject.next(reaction)
  }

  onApplicationBootstrap() {
    const handleReactionChanges = this.handleReactionChanges.bind(this)
    const { LOGGER, client } = this

    client.on(
      'messageReactionAdd',
      (reaction: PartialMessageReaction, user: User) => {
        LOGGER.debug(
          sprintf(
            'User %s has added a reaction %s for message %s',
            user.id,
            reaction.emoji,
            reaction.message.id,
          ),
        )
        handleReactionChanges(reaction)
      },
    )

    client.on(
      'messageReactionRemove',
      (reaction: PartialMessageReaction, user: User) => {
        LOGGER.debug(
          sprintf(
            'User %s has removed a reaction %s for message %s',
            user.id,
            reaction.emoji,
            reaction.message.id,
          ),
        )

        handleReactionChanges(reaction)
      },
    )

    client.on('messageReactionRemoveAll', (message, reactions) => {
      LOGGER.debug(
        sprintf(
          'All reactions have been removed for message %s: %s',
          message.id,
          reactions.map((r) => r.emoji).join(', '),
        ),
      )

      reactions.forEach(handleReactionChanges)
    })

    client.on(
      'messageReactionRemoveEmoji',
      (reaction: PartialMessageReaction) => {
        LOGGER.debug(
          sprintf(
            'The bot has removed reaction %s for message %s',
            reaction.message.id,
            reaction.emoji,
          ),
        )

        handleReactionChanges(reaction)
      },
    )
  }
}
