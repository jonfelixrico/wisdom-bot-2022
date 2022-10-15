import { MessageReaction } from 'discord.js'
import { Observable } from 'rxjs'

export class ReactionChangesObservable extends Observable<MessageReaction> {}
