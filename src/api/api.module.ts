import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { API_BASE_URL } from 'src/env-vars.constants'
import { PendingQuoteApiService } from './pending-quote-api/pending-quote-api.service'
import { QuoteApiService } from './quote-api/quote-api.service'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        baseURL: cfg.getOrThrow<string>(API_BASE_URL),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PendingQuoteApiService, QuoteApiService],
  exports: [PendingQuoteApiService, QuoteApiService],
})
export class ApiModule {}
