import { SlashCommandBuilder } from 'discord.js'

export const ABOUT_COMMAND = new SlashCommandBuilder()
  .setName('about')
  .setDescription('Get info about the bot')
