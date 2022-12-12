import { Test, TestingModule } from '@nestjs/testing'
import { InteractionLoggerService } from './interaction-logger.service'

describe('InteractionLoggerService', () => {
  let service: InteractionLoggerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractionLoggerService],
    }).compile()

    service = module.get<InteractionLoggerService>(InteractionLoggerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
