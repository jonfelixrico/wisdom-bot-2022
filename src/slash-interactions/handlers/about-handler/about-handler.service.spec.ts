import { Test, TestingModule } from '@nestjs/testing'
import { AboutHandlerService } from './about-handler.service'

describe('AboutHandlerService', () => {
  let service: AboutHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboutHandlerService],
    }).compile()

    service = module.get<AboutHandlerService>(AboutHandlerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
