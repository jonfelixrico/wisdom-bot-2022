import { Test, TestingModule } from '@nestjs/testing'
import { QuoteApprovalWatcherService } from './quote-approval-watcher.service'

describe('QuoteApprovalWatcherService', () => {
  let service: QuoteApprovalWatcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteApprovalWatcherService],
    }).compile()

    service = module.get<QuoteApprovalWatcherService>(
      QuoteApprovalWatcherService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
