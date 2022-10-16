import { SlashCommandBuilder } from 'discord.js'
import { CommandBuilder } from '../types'

export const WISDOM_SUBCOMMANDS: CommandBuilder = new SlashCommandBuilder()
  .setName('wisdom')
  .setDescription('Classic wisdom commands')
  .addSubcommand((command) => {
    return (
      command
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
    )
  })
  .addSubcommand((command) => {
    return command
      .setName('submit')
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
