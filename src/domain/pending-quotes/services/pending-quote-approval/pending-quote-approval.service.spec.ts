import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteApprovalService } from './pending-quote-approval.service'

describe('PendingQuoteApprovalService', () => {
  let service: PendingQuoteApprovalService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteApprovalService],
    }).compile()

    service = module.get<PendingQuoteApprovalService>(
      PendingQuoteApprovalService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
