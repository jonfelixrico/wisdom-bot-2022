import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { SubmitQuotePayload } from './model/submit-quote-payload.interface'

@Injectable()
export class PendingQuoteApiService {
  constructor(private http: HttpService) {}

  async submit({ serverId, ...others }: SubmitQuotePayload) {
    await this.http.post(`server/${serverId}/quote/pending`, others)
  }
}
