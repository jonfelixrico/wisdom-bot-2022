import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { GetRandomQuoteOutput } from './model/get-random-quote-io.interface'
import { ReceiveQuoteInput } from './model/receive-quote-io.interface'

@Injectable()
export class QuoteApiService {
  constructor(private http: HttpService) {}

  async receive({ serverId, quoteId, ...others }: ReceiveQuoteInput) {
    const req$ = this.http.post<void>(
      `server/${serverId}/quote/${quoteId}/receive`,
      others,
    )

    await firstValueFrom(req$)
  }

  async getRandomQuote(
    serverId: string,
    authorId?: string,
  ): Promise<GetRandomQuoteOutput> {
    const req$ = this.http.get<GetRandomQuoteOutput>(
      `server/${serverId}/quote/random`,
      {
        params: {
          authorId,
        },
      },
    )

    const { data } = await firstValueFrom(req$)
    return data
  }
}
