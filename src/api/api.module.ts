import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { API_BASE_URL, API_MAX_TIMEOUTS } from 'src/env-vars.constants'
import { PendingQuoteApiService } from './pending-quote-api/pending-quote-api.service'
import { QuoteApiService } from './quote-api/quote-api.service'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        baseURL: cfg.getOrThrow<string>(API_BASE_URL),
        timeout: cfg.get<number>(API_MAX_TIMEOUTS) ?? 5,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PendingQuoteApiService, QuoteApiService],
  exports: [PendingQuoteApiService, QuoteApiService],
})
export class ApiModule {}
