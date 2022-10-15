import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'
import { ReactionListenersService } from './reaction-listeners/reaction-listeners.service'

@Module({
  providers: [ReactionListenersService],
  imports: [DiscordModule],
})
export class EventListenersModule {}
