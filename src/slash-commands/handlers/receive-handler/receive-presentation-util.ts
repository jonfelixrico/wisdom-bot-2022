import { APIEmbed, escapeMarkdown } from 'discord.js'

interface Data {
  content
  authorId
  year
  receiverId
}

const SPACE_CHARACTER = '\u200B'

export function generateResponse(data: Data) {
  const embed: APIEmbed = {
    description: [
      `**"${escapeMarkdown(data.content)}"**`,
      `- <@${data.authorId}>, ${data.year}`,
      '',
      `_Received by <@${data.receiverId}>_`,
    ].join('\n'),

    author: {
      name: 'Quote Received',
    },
  }

  return embed
}

export function generateErrorResponse(data: Data) {
  const embed = generateResponse(data)
  embed.fields = [
    {
      name: SPACE_CHARACTER,
      value: '⚠️ An error was encountered, so this receive was not saved',
    },
  ]

  return embed
}
