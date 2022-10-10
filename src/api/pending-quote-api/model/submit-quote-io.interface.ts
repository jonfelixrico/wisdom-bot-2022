import { BaseSubmitQuoteData } from './base-submit-quote-data.interface'

export interface SubmitQuoteInput
  extends Omit<BaseSubmitQuoteData, 'messageId'> {
  serverId: string
}

export interface SubmitQuoteOutput {
  quoteId: string
}
