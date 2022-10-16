import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ABOUT_COMMAND } from '../about.command'
import { RECEIVE_COMMAND } from '../receive.command'
import { SUBMIT_COMMAND } from '../submit.command'
import { WISDOM_SUBCOMMANDS } from '../wisdom.subcommands'
import { CommandRegistrationService } from 'src/discord/services/command-registration/command-registration.service'
import { CommandBuilder } from 'src/discord/discord.types'

const TO_REGISTER: CommandBuilder[] = [
  RECEIVE_COMMAND,
  SUBMIT_COMMAND,
  ABOUT_COMMAND,
  WISDOM_SUBCOMMANDS,
]

/**
 * @deprecated
 */
@Injectable()
export class CommandRegistrationServiceObs implements OnApplicationBootstrap {
  constructor(private svc: CommandRegistrationService) {}

  async onApplicationBootstrap() {
    this.svc.register(...TO_REGISTER)
  }
}
