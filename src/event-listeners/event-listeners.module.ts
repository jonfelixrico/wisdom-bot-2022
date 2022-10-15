import { Module } from '@nestjs/common'
import { ReactionListenersService } from './reaction-listeners/reaction-listeners.service'

@Module({
  providers: [ReactionListenersService],
})
export class EventListenersModule {}
