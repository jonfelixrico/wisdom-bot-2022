import { MessageReaction, PartialMessageReaction } from 'discord.js'
import { Subject } from 'rxjs'

export class MessageReactionSubject extends Subject<
  MessageReaction | PartialMessageReaction
> {}
