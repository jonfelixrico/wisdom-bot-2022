import { BaseSubmitQuoteData } from './base-submit-quote-data.interface'

export interface SubmitQuotePayload extends BaseSubmitQuoteData {
  serverId: string
}
