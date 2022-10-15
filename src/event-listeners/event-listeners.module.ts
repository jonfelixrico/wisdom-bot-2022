import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { ReactionChangesObservable } from './reaction-changes-observable'
import { ReactionListenersService } from './reaction-listeners/reaction-listeners.service'

@Module({
  providers: [
    ReactionListenersService,
    // For emitting the reaction changes observable as standalone
    {
      provide: ReactionChangesObservable,
      inject: [ReactionListenersService],
      useFactory: (svc: ReactionListenersService) => svc.reactionChanges$,
    },
  ],
  imports: [DiscordModule],

  exports: [ReactionChangesObservable],
})
export class EventListenersModule {}
