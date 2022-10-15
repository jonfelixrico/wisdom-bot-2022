import { Test, TestingModule } from '@nestjs/testing'
import { MessageIdWhitelistImplService } from './message-id-whitelist-impl.service'

describe('MessageIdWhitelistImplService', () => {
  let service: MessageIdWhitelistImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageIdWhitelistImplService],
    }).compile()

    service = module.get<MessageIdWhitelistImplService>(
      MessageIdWhitelistImplService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
