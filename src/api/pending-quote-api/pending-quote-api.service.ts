import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { FinalizeMessageIdInput } from './model/finalize-message-id-io.interface'
import {
  SubmitQuoteInput,
  SubmitQuoteOutput,
} from './model/submit-quote-io.interface'

@Injectable()
export class PendingQuoteApiService {
  constructor(private http: HttpService) {}

  async submit({ serverId, ...others }: SubmitQuoteInput) {
    const req$ = this.http.post<SubmitQuoteOutput>(
      `server/${serverId}/quote/pending`,
      others,
    )

    const { data } = await firstValueFrom(req$)
    return data
  }

  async finalizeMessageId({
    serverId,
    quoteId,
    messageId,
  }: FinalizeMessageIdInput) {
    const req$ = this.http.post(
      `server/${serverId}/quote/pending/${quoteId}/messageId`,
      {
        messageId,
      },
    )

    await firstValueFrom(req$)
  }
}
