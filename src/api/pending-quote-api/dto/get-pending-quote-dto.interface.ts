export class GetPendingQuoteRespDto {
  id: string
  content: string
  submitDt: Date

  authorId: string
  submitterId: string

  expirationDt: Date

  requiredVoteCount: number

  /**
   * Value is serialized date.
   */
  votes: Record<string, string>

  isLegacy?: boolean
  messageId?: string
  channelId?: string

  serverId: string
}
