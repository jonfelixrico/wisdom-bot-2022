import { SlashCommandBuilder } from 'discord.js'

export interface CommandToRegister {
  /**
   * Devland name of the command.
   */
  name: string
  builder:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
}
