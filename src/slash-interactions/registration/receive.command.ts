import { CommandToRegister } from './registration.types'
import { SlashCommandBuilder } from 'discord.js'

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

export const RECEIVE_COMMAND: CommandToRegister = {
  name: 'receive',
  builder,
}
