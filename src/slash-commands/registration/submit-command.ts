import { SlashCommandBuilder } from 'discord.js'

export function buildSubmitCommand () {
    return new SlashCommandBuilder().setName('submit')
}
