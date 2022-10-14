import { APIEmbed } from 'discord.js'

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
