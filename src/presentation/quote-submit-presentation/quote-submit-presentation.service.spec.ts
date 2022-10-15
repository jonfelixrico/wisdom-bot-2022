import { Test, TestingModule } from '@nestjs/testing'
import { QuoteSubmitPresentationService } from './quote-submit-presentation.service'

describe('QuoteSubmitPresentationService', () => {
  let service: QuoteSubmitPresentationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteSubmitPresentationService],
    }).compile()

    service = module.get<QuoteSubmitPresentationService>(
      QuoteSubmitPresentationService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
