import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ABOUT_COMMAND } from '../about.command'
import { RECEIVE_COMMAND } from '../receive.command'
import { CommandBuilder, CommandToRegister } from '../registration.types'
import { SUBMIT_COMMAND } from '../submit.command'
import { Client, REST, Routes } from 'discord.js'
import { ConfigService } from '@nestjs/config'
import { WISDOM_SUBCOMMANDS } from '../wisdom.subcommands'

const TO_REGISTER: CommandToRegister[] = [
  RECEIVE_COMMAND,
  SUBMIT_COMMAND,
  ABOUT_COMMAND,
  WISDOM_SUBCOMMANDS,
]

@Injectable()
export class CommandRegistrationService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(CommandRegistrationService.name)

  constructor(private client: Client, private cfg: ConfigService) {}

  private getGuildIds() {
    const serializedIds = this.cfg.get<string>('REGISTER_GUILD_IDS') ?? ''
    return serializedIds.split(',').map((s) => s.trim())
  }

  private get registerToGuildsOnly() {
    return (
      this.cfg.get<string>('REGISTER_GUILDS_ONLY')?.toLowerCase() === 'true'
    )
  }

  private get restClient() {
    return new REST({ version: '10' }).setToken(this.client.token)
  }

  private get applicationId() {
    return this.client.application.id
  }

  private async registerToGuilds(
    guildIds: string[],
    commands: CommandBuilder[],
  ) {
    const { LOGGER } = this

    LOGGER.debug(`Registering commands for ${guildIds.length} guilds...`)
    for (const guildId of guildIds) {
      await this.restClient.put(
        Routes.applicationGuildCommands(this.applicationId, guildId),
        {
          body: commands,
        },
      )
      LOGGER.log(`Registered the commands for ${guildId}`)
    }

    LOGGER.debug(
      `Successfully registered the commands for ${guildIds.length} guilds`,
    )
  }

  private async registerToAll(commands: CommandBuilder[]) {
    await this.restClient.put(Routes.applicationCommands(this.applicationId), {
      body: { commands },
    })
    this.LOGGER.log('Registered the application commands')
  }

  async onApplicationBootstrap() {
    const { LOGGER } = this

    const builders: CommandBuilder[] = []

    LOGGER.log(`Preparing to register ${TO_REGISTER.length} commands...`)
    for (const { name, builder } of TO_REGISTER) {
      builders.push(builder)
      LOGGER.debug(`Prepared command ${name}`)
    }

    LOGGER.log(`Prepared ${TO_REGISTER.length} command/s for registration.`)

    if (this.registerToGuildsOnly) {
      LOGGER.log('Registering to guilds only...')
      await this.registerToGuilds(this.getGuildIds(), builders)
    } else {
      LOGGER.log('Registering globally...')
      await this.registerToAll(builders)
    }

    LOGGER.log('Registration complete.')
  }
}
