import { Test, TestingModule } from '@nestjs/testing'
import { ApiInfoService } from './api-info.service'

describe('ApiInfoService', () => {
  let service: ApiInfoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiInfoService],
    }).compile()

    service = module.get<ApiInfoService>(ApiInfoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
