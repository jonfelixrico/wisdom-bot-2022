import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client, GatewayIntentBits } from 'discord.js'
import { DISCORD_TOKEN } from 'src/env-vars.constants'

function clientFactory(cfg: ConfigService) {
  return new Promise((resolve, reject) => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] })

    client.once('ready', () => {
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
