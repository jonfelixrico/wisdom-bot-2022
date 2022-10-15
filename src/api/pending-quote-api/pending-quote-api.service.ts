import { HttpService } from 'nestjs-http-promise'
import { Injectable } from '@nestjs/common'
import {
  SubmitQuoteInput,
  SubmitQuoteOutput,
} from './model/submit-quote-io.interface'
import {
  GetPendingQuoteByMessageIdReq,
  GetPendingQuoteByMessageIdRes,
} from './model/get-pending-quote-by-message-id.dto'

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

  async getPendingQuoteByMessageId({
    serverId,
    messageId,
  }: GetPendingQuoteByMessageIdReq): Promise<GetPendingQuoteByMessageIdRes> {
    const { data } = await this.http.get<GetPendingQuoteByMessageIdRes>(
      `server/${serverId}/quote/pending/discord-message/${messageId}`,
    )

    return data
  }
}
