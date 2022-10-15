import { CommandToRegister } from './registration.types'
import { SlashCommandBuilder } from 'discord.js'

const builder = new SlashCommandBuilder()
  .setName('about')
  .setDescription('Get info about the bot')

export const ABOUT_COMMAND: CommandToRegister = {
  name: 'about',
  builder,
}
