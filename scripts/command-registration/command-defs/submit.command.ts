import { SlashCommandBuilder } from 'discord.js'

export const SUBMIT_COMMAND = new SlashCommandBuilder()
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
