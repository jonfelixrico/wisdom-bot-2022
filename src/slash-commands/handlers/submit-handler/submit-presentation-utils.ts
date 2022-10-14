import { APIEmbed } from 'discord.js'

const SPACE_CHARACTER = '\u200B'
export interface ReplyData {
  serverId: string
  content: string
  authorId: string
  year: number
  submitterId: string
  submitterIconUrl?: string
  authorIconUrl?: string
}

export function generateResponse(data: ReplyData) {
  const embed: APIEmbed = {
    author: {
      name: 'Quote Submitted',
      icon_url: data.submitterIconUrl,
    },

    description: [
      `**"${data.content}"**`,
      `- <@${data.authorId}>, ${data.year}`,
      '',
      `_Submitted by <@${data.submitterId}>_`,
    ].join('\n'),

    thumbnail: {
      url: data.authorIconUrl,
    },
  }

  return embed
}

export function generateErrorResponse(data: ReplyData) {
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
