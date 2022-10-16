import { HttpService } from 'nestjs-http-promise'
import { Injectable } from '@nestjs/common'
import {
  SubmitQuoteReqDto,
  SubmitQuoteRespDto,
} from './dto/submit-quote-dto.interface'

@Injectable()
export class PendingQuoteApiService {
  constructor(private http: HttpService) {}

  async submit({ serverId, ...others }: SubmitQuoteReqDto) {
    const { data } = await this.http.post<SubmitQuoteRespDto>(
      `server/${serverId}/quote/pending`,
      others,
    )

    return data
  }

  async addVote(data: { serverId: string; quoteId: string; userId: string }) {
    await this.http.post(
      `server/${data.serverId}/quote/pending/${data.quoteId}/vote`,
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
