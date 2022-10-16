import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteApiService } from './pending-quote-api.service'

describe('PendingQuoteApiService', () => {
  let service: PendingQuoteApiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteApiService],
    }).compile()

    service = module.get<PendingQuoteApiService>(PendingQuoteApiService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
