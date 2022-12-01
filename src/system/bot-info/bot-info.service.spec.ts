import { Test, TestingModule } from '@nestjs/testing'
import { BotInfoService } from './bot-info.service'

describe('BotInfoService', () => {
  let service: BotInfoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotInfoService],
    }).compile()

    service = module.get<BotInfoService>(BotInfoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
