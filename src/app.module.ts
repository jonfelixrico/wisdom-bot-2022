import { Module } from '@nestjs/common'
import { SlashInteractionsModule } from './slash-interactions/slash-interactions.module'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { SystemModule } from './system/system.module'
import { ApiModule } from './api/api.module'
import { PendingQuotesModule } from './domain/pending-quotes/pending-quotes.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.development.env'],
    }),
    SlashInteractionsModule,
    DiscordModule,
    SystemModule,
    ApiModule,
    PendingQuotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
