export interface SubmitQuoteInput {
  serverId: string
  content: string
  authorId: string
  submitterId: string
  channelId: string
  messageId: string
}

export interface SubmitQuoteOutput {
  quoteId: string
}
