import { HttpModule } from 'nestjs-http-promise'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { API_BASE_URL } from 'src/env-vars.constants'
import { PendingQuoteApiService } from './pending-quote-api/pending-quote-api.service'
import { QuoteApiService } from './quote-api/quote-api.service'
import { ApiInfoService } from './api-info/api-info.service'

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
  providers: [PendingQuoteApiService, QuoteApiService, ApiInfoService],
  exports: [PendingQuoteApiService, QuoteApiService],
})
export class ApiModule {}
