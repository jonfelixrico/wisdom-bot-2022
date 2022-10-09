import { CommandToRegister } from './types'
import { SlashCommandBuilder } from 'discord.js'

export function buildReceiveCommand(): CommandToRegister {
  const builder = new SlashCommandBuilder()
    .setName('receive')
    .setDescription('Receive a random quote')
    /*
     * Basically filters the receive to the ones by a specific user
     */
    .addUserOption((option) => {
      return option
        .setName('user')
        .setDescription('Limit the quotes to the one by this user')
        .setRequired(false)
    })
  return {
    name: 'receive',
    builder,
  }
}
