export interface SubmitQuoteReqDto {
  serverId: string
  content: string
  authorId: string
  submitterId: string
  channelId: string
  messageId: string
}

export interface SubmitQuoteRespDto {
  quoteId: string
}
