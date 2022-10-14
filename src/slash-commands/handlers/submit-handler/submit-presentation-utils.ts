import { APIEmbed } from 'discord.js'

interface SubmitData {
  serverId: string
  content: string
  authorId: string
  year: number
  submitterId: string
}

export function generateSubmitResponse(data: SubmitData) {
  const embed: APIEmbed = {
    author: {
      name: 'Quote Submitted',
    },

    description: [
      `**"${data.content}"**`,
      `- <@${data.authorId}>, ${data.year}`,
      '',
      `Submitted by <@${data.submitterId}>`,
    ].join('\n'),
  }

  return embed
}
