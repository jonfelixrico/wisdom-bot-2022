import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteExpirationService } from './pending-quote-expiration.service'

describe('PendingQuoteExpirationService', () => {
  let service: PendingQuoteExpirationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteExpirationService],
    }).compile()

    service = module.get<PendingQuoteExpirationService>(
      PendingQuoteExpirationService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
