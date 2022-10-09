import { Module } from '@nestjs/common'
import { DISCORD_CLIENT_PROVIDER } from './discord-client.provider'

@Module({
  providers: [DISCORD_CLIENT_PROVIDER],
  exports: [DISCORD_CLIENT_PROVIDER],
})
export class DiscordModule {}
