import { Module } from '@nestjs/common'
import { DISCORD_CLIENT_PROVIDER } from './discord-client.provider'
import { ReactionChangesObservable } from './reaction-changes-observable'
import { ReactionListenersService } from './reaction-listeners/reaction-listeners.service'
import { MessageIdWhitelistImplService } from './message-id-whitelist-impl/message-id-whitelist-impl.service'

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
  ],
  exports: [DISCORD_CLIENT_PROVIDER, ReactionChangesObservable],
})
export class DiscordModule {}
