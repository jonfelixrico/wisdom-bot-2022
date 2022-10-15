import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'

export type CommandBuilder =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  | SlashCommandSubcommandsOnlyBuilder

export interface CommandToRegister {
  /**
   * Devland name of the command.
   */
  name: string
  builder: CommandBuilder
}
