import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveHandlerService } from './receive-handler.service'

describe('ReceiveHandlerService', () => {
  let service: ReceiveHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveHandlerService],
    }).compile()

    service = module.get<ReceiveHandlerService>(ReceiveHandlerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
