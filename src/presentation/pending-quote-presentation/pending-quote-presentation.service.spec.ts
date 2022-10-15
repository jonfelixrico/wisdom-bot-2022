import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuotePresentationService } from './pending-quote-presentation.service'

describe('PendingQuotePresentationService', () => {
  let service: PendingQuotePresentationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuotePresentationService],
    }).compile()

    service = module.get<PendingQuotePresentationService>(
      PendingQuotePresentationService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
