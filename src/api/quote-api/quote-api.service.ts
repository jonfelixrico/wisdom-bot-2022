import { HttpService } from 'nestjs-http-promise'
import { Injectable } from '@nestjs/common'
import { GetRandomQuoteOutput } from './model/get-random-quote-io.interface'
import { ReceiveQuoteInput } from './model/receive-quote-io.interface'

@Injectable()
export class QuoteApiService {
  constructor(private http: HttpService) {}

  async receive({ quoteId, ...others }: ReceiveQuoteInput) {
    await this.http.post<void>(`quote/${quoteId}/receive`, others)
  }

  async getRandomQuote(
    serverId: string,
    authorId?: string,
  ): Promise<GetRandomQuoteOutput> {
    const { data } = await this.http.get<GetRandomQuoteOutput>(
      `server/${serverId}/quote/random`,
      {
        params: {
          authorId,
        },
      },
    )

    return data
  }
}
