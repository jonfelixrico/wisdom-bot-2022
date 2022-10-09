import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
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

    return (await firstValueFrom(req$)).data
  }
}
