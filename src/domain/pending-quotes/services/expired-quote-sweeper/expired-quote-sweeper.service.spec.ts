import { Test, TestingModule } from '@nestjs/testing'
import { ExpiredQuoteSweeperService } from './expired-quote-sweeper.service'

describe('ExpiredQuoteSweeperService', () => {
  let service: ExpiredQuoteSweeperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpiredQuoteSweeperService],
    }).compile()

    service = module.get<ExpiredQuoteSweeperService>(ExpiredQuoteSweeperService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
