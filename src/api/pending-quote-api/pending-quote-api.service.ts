import { HttpService } from 'nestjs-http-promise'
import { Injectable } from '@nestjs/common'
import {
  SubmitQuoteInput,
  SubmitQuoteOutput,
} from './model/submit-quote-io.interface'

@Injectable()
export class PendingQuoteApiService {
  constructor(private http: HttpService) {}

  async submit({ serverId, ...others }: SubmitQuoteInput) {
    const { data } = await this.http.post<SubmitQuoteOutput>(
      `server/${serverId}/quote/pending`,
      others,
    )

    return data
  }

  async addVote(data: { serverId: string; quoteId: string; userId: string }) {
    await this.http.post(
      `server/${data.serverId}/quote/pending/${data.quoteId}`,
      {
        userId: data.userId,
      },
    )
  }

  async finalizeStatus(data: { serverId: string; quoteId: string }) {
    await this.http.post(
      `server/${data.serverId}/quote/pending/${data.quoteId}/status`,
      {
        status: 'APPROVED',
      },
    )
  }
}
