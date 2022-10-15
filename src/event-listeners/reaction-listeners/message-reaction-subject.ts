import { PartialMessageReaction } from 'discord.js'
import { Subject } from 'rxjs'

export class MessageReactionSubject extends Subject<PartialMessageReaction> {
  /*
   * `PartialMessageReaction` is just `MessageReaction` without the `count` property.
   */
}
