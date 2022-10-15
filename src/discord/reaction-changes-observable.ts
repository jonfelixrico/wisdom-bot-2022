import { PartialMessageReaction } from 'discord.js'
import { Observable } from 'rxjs'

export class ReactionChangesObservable extends Observable<PartialMessageReaction> {}
