import { Module } from '@nestjs/common'
import { DiscordInteractionsModule } from './discord-interactions/discord-interactions.module'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { SystemModule } from './system/system.module'
import { ApiModule } from './api/api.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.development.env'],
    }),
    DiscordInteractionsModule,
    DiscordModule,
    SystemModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
