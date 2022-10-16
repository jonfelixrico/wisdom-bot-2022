import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client, REST, Routes } from 'discord.js'
import { sprintf } from 'sprintf'
import {
  REGISTER_GUILDS_ONLY,
  REGISTER_GUILD_IDS,
} from 'src/env-vars.constants'
import { CommandBuilder } from 'src/slash-interactions/registration/registration.types'

@Injectable()
export class CommandRegistrationService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(CommandRegistrationService.name)

  constructor(private client: Client, private cfg: ConfigService) {}

  private get guildIds() {
    const serializedIds = this.cfg.get<string>(REGISTER_GUILD_IDS) ?? ''
    return serializedIds.split(',').map((s) => s.trim())
  }

  private get registerToGuildsOnly() {
    return this.cfg.get<boolean>(REGISTER_GUILDS_ONLY)
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

    for (const guildId of guildIds) {
      try {
        await this.restClient.put(
          Routes.applicationGuildCommands(this.applicationId, guildId),
          {
            body: commands,
          },
        )
      } catch (e) {
        LOGGER.error(
          sprintf(
            'Error encountered while trying to register commands for guild %s',
            guildId,
          ),
          e,
        )
      }
    }
  }

  async register(commands: CommandBuilder[]) {
    if (this.registerToGuildsOnly) {
      await this.registerToGuilds(this.guildIds, commands)
      return
    }

    try {
      await this.restClient.put(
        Routes.applicationCommands(this.applicationId),
        {
          body: { commands },
        },
      )
    } catch (e) {
      this.LOGGER.error(
        'Error encountered while trying to register global commands',
        e,
      )
    }
  }

  onApplicationBootstrap() {
    if (this.registerToGuildsOnly) {
      this.LOGGER.log('Mode: guild registration')
      this.LOGGER.debug(sprintf('Target guilds:\n%s', this.guildIds.join('\n')))
      return
    }

    this.LOGGER.log('Mode: global registration')
  }
}
