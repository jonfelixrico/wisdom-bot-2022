import { Test, TestingModule } from '@nestjs/testing'
import { SubmitHandlerService } from './submit-handler.service'

describe('SubmitHandlerService', () => {
  let service: SubmitHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitHandlerService],
    }).compile()

    service = module.get<SubmitHandlerService>(SubmitHandlerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
