import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import {
  SubmitQuoteInput,
  SubmitQuoteOutput,
} from './model/submit-quote-io.interface'

@Injectable()
export class PendingQuoteApiService {
  private readonly LOGGER = new Logger(PendingQuoteApiService.name)

  constructor(private http: HttpService) {}

  async submit({ serverId, ...others }: SubmitQuoteInput) {
    const req$ = this.http.post<SubmitQuoteOutput>(
      `server/${serverId}/quote/pending`,
      others,
    )

    const { data } = await firstValueFrom(req$)
    return data
  }
}
