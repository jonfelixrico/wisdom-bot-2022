import { Module } from '@nestjs/common'
import { DISCORD_CLIENT_PROVIDER } from './providers/discord-client.provider'
import { UserAvatarService } from './services/user-avatar/user-avatar.service'
import { MessageService } from './services/message/message.service'

@Module({
  providers: [DISCORD_CLIENT_PROVIDER, UserAvatarService, MessageService],
  exports: [DISCORD_CLIENT_PROVIDER, UserAvatarService],
})
export class DiscordModule {}
