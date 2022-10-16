export class GetPendingQuoteRespDto {
  id: string
  content: string
  submitDt: Date

  authorId: string
  submitterId: string

  expirationDt: Date

  requiredVoteCount: number
  votes: Record<string, Date>
}
