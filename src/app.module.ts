import { Module } from '@nestjs/common'
import { SlashCommandsModule } from './slash-commands/slash-commands.module'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { SystemModule } from './system/system.module'
import { ApiModule } from './api/api.module'
import { BackgroundServicesModule } from './background-services/background-services.module'
import { PresentationModule } from './presentation/presentation.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.development.env'],
    }),
    SlashCommandsModule,
    DiscordModule,
    SystemModule,
    ApiModule,
    BackgroundServicesModule,
    PresentationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
