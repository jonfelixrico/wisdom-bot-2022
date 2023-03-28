import { Logger, Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client, GatewayIntentBits } from 'discord.js'
import { DISCORD_TOKEN } from 'src/env-vars.constants'

function clientFactory(cfg: ConfigService) {
  return new Promise((resolve, reject) => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] })

    const LOGGER = new Logger('DiscordClient')
    client.on('debug', (message) => LOGGER.debug(message))
    client.on('error', (error) => LOGGER.error(error))

    client.once('ready', () => {
      LOGGER.log('Logged in successfully')
      resolve(client)
    })
    client.login(cfg.getOrThrow(DISCORD_TOKEN)).catch((e) => reject(e))
  })
}

export const DISCORD_CLIENT_PROVIDER: Provider = {
  inject: [ConfigService],
  useFactory: clientFactory,
  provide: Client,
}
