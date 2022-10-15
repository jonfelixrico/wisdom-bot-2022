import { CacheType, Interaction } from 'discord.js'
import { Subject } from 'rxjs'

export class InteractionEventBus extends Subject<Interaction<CacheType>> {}
