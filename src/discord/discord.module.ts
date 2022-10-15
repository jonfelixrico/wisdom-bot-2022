import { Module } from '@nestjs/common'
import { DISCORD_CLIENT_PROVIDER } from './discord-client.provider'
import { ReactionChangesObservable } from './reaction-changes-observable'
import { ReactionListenersService } from './reaction-listeners/reaction-listeners.service'
import { MessageIdWhitelistImplService } from './message-id-whitelist-impl/message-id-whitelist-impl.service'
import { MessageIdWhitelist } from './message-id-whitelist.abstract'

@Module({
  providers: [
    DISCORD_CLIENT_PROVIDER,
    ReactionListenersService,
    // For emitting the reaction changes observable as standalone
    {
      provide: ReactionChangesObservable,
      inject: [ReactionListenersService],
      useFactory: (svc: ReactionListenersService) => svc.reactionChanges$,
    },
    MessageIdWhitelistImplService,
    {
      provide: MessageIdWhitelist,
      useExisting: MessageIdWhitelistImplService,
    },
  ],
  exports: [
    DISCORD_CLIENT_PROVIDER,
    ReactionChangesObservable,
    MessageIdWhitelist,
  ],
})
export class DiscordModule {}
