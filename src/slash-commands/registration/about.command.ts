import { CommandToRegister } from './types'
import { SlashCommandBuilder } from 'discord.js'

const builder = new SlashCommandBuilder()
  .setName('about')
  .setDescription('Get info about the Wisdom bot')

export const ABOUT_COMMAND: CommandToRegister = {
  name: 'about',
  builder,
}
