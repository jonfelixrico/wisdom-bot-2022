import { Module } from '@nestjs/common'
import { DISCORD_CLIENT_PROVIDER } from './providers/discord-client.provider'
import { CommandRegistrationService } from './services/command-registration/command-registration.service';

@Module({
  providers: [DISCORD_CLIENT_PROVIDER, CommandRegistrationService],
  exports: [DISCORD_CLIENT_PROVIDER],
})
export class DiscordModule {}
