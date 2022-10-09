import { Module } from '@nestjs/common'
import { SubmitHandlerService } from './handlers/submit-handler/submit-handler.service'
import { ReceiveHandlerService } from './handlers/receive-handler/receive-handler.service'
import { DiscordModule } from 'src/discord/discord.module'
import { CommandRegistrationService } from './registration/command-registration/command-registration.service'

@Module({
  providers: [
    SubmitHandlerService,
    ReceiveHandlerService,
    CommandRegistrationService,
  ],
  imports: [DiscordModule],
})
export class SlashCommandsModule {}
