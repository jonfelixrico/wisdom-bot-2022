import { Module } from '@nestjs/common'
import { ApiModule } from 'src/api/api.module'
import { DiscordModule } from 'src/discord/discord.module'
import { ReactionListenersService } from './reaction-listeners/reaction-listeners.service'

@Module({
  providers: [ReactionListenersService],
  imports: [DiscordModule, ApiModule],
})
export class EventListenersModule {}
