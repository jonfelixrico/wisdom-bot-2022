import { APIEmbed } from 'discord.js'

const SPACE_CHARACTER = '\u200B'
interface Data {
  serverId: string
  content: string
  authorId: string
  year: number
  submitterId: string
}

export function generateResponse(data: Data) {
  const embed: APIEmbed = {
    author: {
      name: 'Quote Submitted',
    },

    description: [
      `**"${data.content}"**`,
      `- <@${data.authorId}>, ${data.year}`,
      '',
      `_Submitted by <@${data.submitterId}>_`,
    ].join('\n'),
  }

  return embed
}

export function generateErrorResponse(data: Data) {
  const embed = generateResponse(data)

  embed.fields = [
    {
      name: SPACE_CHARACTER,
      value: '⚠️ An error was encountered, so this submission was not saved',
    },
  ]
  embed.author.name = '⚠️ Quote Submitted'

  return embed
}
