import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteMessageGeneratorService } from './pending-quote-message-generator.service'

describe('PendingQuoteMessageGeneratorService', () => {
  let service: PendingQuoteMessageGeneratorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteMessageGeneratorService],
    }).compile()

    service = module.get<PendingQuoteMessageGeneratorService>(
      PendingQuoteMessageGeneratorService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
