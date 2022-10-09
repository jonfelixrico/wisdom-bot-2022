import { Module } from '@nestjs/common'
import { SlashCommandsModule } from './slash-commands/slash-commands.module'
import { DiscordModule } from './discord/discord.module'

@Module({
  imports: [SlashCommandsModule, DiscordModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
