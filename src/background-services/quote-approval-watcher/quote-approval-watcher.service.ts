import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { MessageReaction } from 'discord.js'
import { ReactionChangesObservable } from 'src/discord/reaction-changes-observable'

@Injectable()
export class QuoteApprovalWatcherService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(QuoteApprovalWatcherService.name)

  constructor(private obs: ReactionChangesObservable) {}

  private handler(emit: MessageReaction) {
    // TODO implement this
  }

  onApplicationBootstrap() {
    this.obs.subscribe(this.handler.bind(this))
    this.LOGGER.log('Now watching for quote approvals...')
  }
}
