import { APIEmbed, escapeMarkdown } from 'discord.js'

interface Data {
  content
  authorId
  year
  receiverId
}

const SPACE_CHARACTER = '\u200B'

export function generateReceiveResponse(data: Data) {
  const embed: APIEmbed = {
    description: [
      `**"${escapeMarkdown(data.content)}"**`,
      `- <@${data.authorId}>, ${data.year}`,
    ].join('\n'),

    author: {
      name: 'Quote Received',
    },

    fields: [
      {
        name: SPACE_CHARACTER,
        value: `Received by <@${data.receiverId}>`,
      },
    ],
  }

  return embed
}
