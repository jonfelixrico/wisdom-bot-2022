import { Test, TestingModule } from '@nestjs/testing'
import { UpvoteHandlerService } from './upvote-handler.service'

describe('UpvoteHandlerService', () => {
  let service: UpvoteHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpvoteHandlerService],
    }).compile()

    service = module.get<UpvoteHandlerService>(UpvoteHandlerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
