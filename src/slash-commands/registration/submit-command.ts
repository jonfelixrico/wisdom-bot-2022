import { SlashCommandBuilder } from 'discord.js'
import { CommandToRegister } from './types'

export function buildSubmitCommand(): CommandToRegister {
  const builder = new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Submit a quote')
    .addStringOption((option) => {
      return option
        .setName('quote')
        .setDescription('The quote to be added')
        .setRequired(true)
    })
    .addUserOption((option) => {
      return option
        .setName('autor')
        .setDescription('The user who said the quote')
    })

  return {
    builder,
    name: 'submit',
  }
}
