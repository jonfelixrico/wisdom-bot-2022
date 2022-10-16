import { Test, TestingModule } from '@nestjs/testing'
import { CommandRegistrationServiceObs } from './command-registration.service'

describe('CommandRegistrationService', () => {
  let service: CommandRegistrationServiceObs

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandRegistrationServiceObs],
    }).compile()

    service = module.get<CommandRegistrationServiceObs>(
      CommandRegistrationServiceObs,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
