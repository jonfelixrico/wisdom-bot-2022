import { Test, TestingModule } from '@nestjs/testing'
import { MessageIdStartupWhitelisterService } from './message-id-startup-whitelister.service'

describe('MessageIdStartupWhitelisterService', () => {
  let service: MessageIdStartupWhitelisterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageIdStartupWhitelisterService],
    }).compile()

    service = module.get<MessageIdStartupWhitelisterService>(
      MessageIdStartupWhitelisterService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
