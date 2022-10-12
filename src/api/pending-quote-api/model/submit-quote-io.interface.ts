import { BaseSubmitQuoteData } from './base-submit-quote-data.interface'

export interface SubmitQuoteInput extends BaseSubmitQuoteData {
  serverId: string
}

export interface SubmitQuoteOutput {
  quoteId: string
}
