import { SlashCommandBuilder } from 'discord.js'

export const ABOUT_COMMAND_NAME = 'about'

export const ABOUT_COMMAND = new SlashCommandBuilder()
  .setName(ABOUT_COMMAND_NAME)
  .setDescription('Get info about the bot')
