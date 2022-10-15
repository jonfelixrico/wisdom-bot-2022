export interface GetPendingQuoteByMessageIdRes {
  id: string
  requiredVoteCount: number
  expireDt: Date
  votes: Record<string, Date>
}

export interface GetPendingQuoteByMessageIdReq {
  messageId: string
  serverId: string
}
