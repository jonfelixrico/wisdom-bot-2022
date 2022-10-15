import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { DISCORD_TOKEN } from 'src/env-vars.constants'

function clientFactory(cfg: ConfigService) {
  return new Promise((resolve, reject) => {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
      ],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
      ],
    })

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
