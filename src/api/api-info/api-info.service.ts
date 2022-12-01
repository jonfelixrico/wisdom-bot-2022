import { Injectable } from '@nestjs/common'
import { HttpService } from 'nestjs-http-promise'

@Injectable()
export class ApiInfoService {
  constructor(private http: HttpService) {}

  async getVersion(): Promise<string> {
    const { data } = await this.http.get<{ version: string }>('/version')
    return data.version
  }
}
