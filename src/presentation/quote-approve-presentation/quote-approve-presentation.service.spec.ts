import { Test, TestingModule } from '@nestjs/testing'
import { QuoteApprovePresentationService } from './quote-approve-presentation.service'

describe('QuoteApprovePresentationService', () => {
  let service: QuoteApprovePresentationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteApprovePresentationService],
    }).compile()

    service = module.get<QuoteApprovePresentationService>(
      QuoteApprovePresentationService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
