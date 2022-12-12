import { Module } from '@nestjs/common'
import { DiscordModule } from './discord/discord.module'
import { ConfigModule } from '@nestjs/config'
import { ApiModule } from './api/api.module'
import { PendingQuotesModule } from './domain/pending-quotes/pending-quotes.module'
import { ScheduleModule } from '@nestjs/schedule'
import { QuotesModule } from './domain/quotes/quotes.module'
import { SystemModule } from './domain/system/system.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.defaults'],
    }),
    DiscordModule,
    ApiModule,
    PendingQuotesModule,
    ScheduleModule.forRoot(),
    QuotesModule,
    SystemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
