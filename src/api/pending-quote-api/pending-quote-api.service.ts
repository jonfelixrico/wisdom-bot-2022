import { HttpService } from 'nestjs-http-promise'
import { Injectable } from '@nestjs/common'
import {
  SubmitQuoteReqDto,
  SubmitQuoteRespDto,
} from './dto/submit-quote-dto.interface'
import { GetPendingQuoteRespDto } from './dto/get-pending-quote-dto.interface'

@Injectable()
export class PendingQuoteApiService {
  constructor(private http: HttpService) {}

  async submit({ serverId, ...others }: SubmitQuoteReqDto) {
    const { data } = await this.http.post<SubmitQuoteRespDto>(
      `server/${serverId}/pending-quote`,
      others,
    )

    return data
  }

  async addVote(data: { serverId: string; quoteId: string; userId: string }) {
    await this.http.post(`pending-quote/${data.quoteId}/vote`, {
      userId: data.userId,
    })
  }

  async finalizeStatus(data: {
    quoteId: string
    status: 'APPROVED' | 'EXPIRED'
  }) {
    await this.http.post(`pending-quote/${data.quoteId}/status`, {
      status: data.status,
    })
  }

  async get(reqParams: { quoteId: string }): Promise<GetPendingQuoteRespDto> {
    try {
      const { data } = await this.http.get(`pending-quote/${reqParams.quoteId}`)
      return data
    } catch (e) {
      if (e.response?.status === 404) {
        return null
      }

      throw e
    }
  }

  async getExpiredQuotes(params: { serverId: string }) {
    const { data } = await this.http.get<GetPendingQuoteRespDto[]>(
      `server/${params.serverId}/pending-quote`,
      {
        params: {
          expiringBefore: new Date(),
        },
      },
    )

    return data
  }
}
