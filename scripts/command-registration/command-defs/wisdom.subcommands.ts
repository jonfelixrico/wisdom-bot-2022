import { SlashCommandBuilder } from 'discord.js'
import { CommandBuilder } from '../types'

export const WISDOM_COMMAND_NAME = 'wisdom'
export const WISDOM_SUBMIT_SUBCOMMAND_NAME = 'submit'
export const WISDOM_RECEIVE_SUBCOMMAND_NAME = 'receive'
export const WISDOM_ABOUT_SUBCOMMAND_NAME = 'about'

export const WISDOM_SUBCOMMANDS: CommandBuilder = new SlashCommandBuilder()
  .setName(WISDOM_COMMAND_NAME)
  .setDescription('Classic wisdom commands')
  .addSubcommand((command) => {
    return (
      command
        .setName(WISDOM_RECEIVE_SUBCOMMAND_NAME)
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
    )
  })
  .addSubcommand((command) => {
    return command
      .setName(WISDOM_SUBMIT_SUBCOMMAND_NAME)
      .setDescription('Submit a quote')
      .addStringOption((option) => {
        return option
          .setName('quote')
          .setDescription('The quote to be added')
          .setRequired(true)
          .setMinLength(1)
      })
      .addUserOption((option) => {
        return option
          .setName('author')
          .setDescription('The user who said the quote')
          .setRequired(true)
      })
  })
  .addSubcommand((command) => {
    return command
      .setName(WISDOM_ABOUT_SUBCOMMAND_NAME)
      .setDescription('Get info about the bot')
  })
