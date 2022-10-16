import 'dotenv-defaults/config'
import { REST, Routes } from 'discord.js'
import { CommandBuilder } from './types'

const GUILD_IDS =
  process.env.REGISTER_GUILD_IDS?.split(',').map((s) => s.trim()) ?? []
const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN
const APPLICATION_ID: string = process.env.APPLICATION_ID

export async function sendToApi(...commands: CommandBuilder[]) {
  const client = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

  if (!GUILD_IDS.length) {
    console.log('Globally registering commands')
    try {
      await client.put(Routes.applicationCommands(APPLICATION_ID), {
        body: commands,
      })
    } catch (e) {
      console.error('Error encountered while globally registering commands', e)
      throw e
    }
    return
  }

  for (const guildId of GUILD_IDS) {
    console.log('Registering commands for %s', guildId)

    try {
      await client.put(
        Routes.applicationGuildCommands(APPLICATION_ID, guildId),
        {
          body: commands,
        },
      )
    } catch (e) {
      console.error(
        'Error encountered while trying to register command for %s',
        guildId,
        e,
      )

      throw e
    }
  }
}
