import { Test, TestingModule } from '@nestjs/testing'
import { ReactionListenersService } from './reaction-listeners.service'

describe('ReactionListenersService', () => {
  let service: ReactionListenersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionListenersService],
    }).compile()

    service = module.get<ReactionListenersService>(ReactionListenersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
