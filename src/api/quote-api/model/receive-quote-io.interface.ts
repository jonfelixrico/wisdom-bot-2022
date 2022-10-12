import { BaseReceiveQuoteData } from './base-receive-quote-data.interface'

export interface ReceiveQuoteInput extends BaseReceiveQuoteData {
  quoteId: string
  serverId: string
}
