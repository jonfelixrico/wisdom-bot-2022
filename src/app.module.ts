import { Module } from '@nestjs/common'
import { SlashInteractionsModule } from './slash-interactions/slash-interactions.module'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { ApiModule } from './api/api.module'
import { PendingQuotesModule } from './domain/pending-quotes/pending-quotes.module'
import { ScheduleModule } from '@nestjs/schedule'
import { QuotesModule } from './domain/quotes/quotes.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.development.env'],
    }),
    SlashInteractionsModule,
    DiscordModule,
    ApiModule,
    PendingQuotesModule,
    ScheduleModule.forRoot(),
    QuotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
