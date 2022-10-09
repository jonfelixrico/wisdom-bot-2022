import { Module } from '@nestjs/common'
import { SlashCommandsModule } from './slash-commands/slash-commands.module'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.development.env'],
    }),
    SlashCommandsModule,
    DiscordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
