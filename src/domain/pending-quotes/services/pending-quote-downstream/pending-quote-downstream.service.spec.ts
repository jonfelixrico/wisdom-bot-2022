import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteDownstreamService } from './pending-quote-downstream.service'

describe('PendingQuoteDownstreamService', () => {
  let service: PendingQuoteDownstreamService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteDownstreamService],
    }).compile()

    service = module.get<PendingQuoteDownstreamService>(
      PendingQuoteDownstreamService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
