import { SlashCommandBuilder } from 'discord.js'

export const RECEIVE_COMMAND_NAME = 'receive'

export const RECEIVE_COMMAND = new SlashCommandBuilder()
  .setName(RECEIVE_COMMAND_NAME)
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
