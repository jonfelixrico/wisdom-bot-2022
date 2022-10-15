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

  async getPendingQuoteMessageIds(serverId: string): Promise<string[]> {
    const { data } = await this.http.get<string[]>(
      `server/${serverId}/quote/pending/discord-message`,
    )

    return data
  }
}
