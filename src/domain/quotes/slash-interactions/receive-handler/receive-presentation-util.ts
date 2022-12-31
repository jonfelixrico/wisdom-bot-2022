import { APIEmbed, escapeMarkdown } from 'discord.js'

export interface ReplyData {
  content: string
  authorId: string
  year: number
  receiverId: string
  receiverIconUrl?: string
  quoteAuthorIconUrl?: string
}

const SPACE_CHARACTER = '\u200B'

export function generateReply(data: ReplyData) {
  const embed: APIEmbed = {
    description: [
      `**"${escapeMarkdown(data.content)}"**`,
      `- <@${data.authorId}>, ${data.year}`,
    ].join('\n'),

    author: {
      name: 'Quote Received',
      icon_url: data.receiverIconUrl,
    },

    thumbnail: {
      url: data.quoteAuthorIconUrl,
    },
  }

  return embed
}

export function generateErrorReply(data: ReplyData) {
  const embed = generateReply(data)

  embed.fields = [
    {
      name: SPACE_CHARACTER,
      value: '⚠️ An error was encountered, so this receive was not saved',
    },
  ]
  embed.author.name = '⚠️ Quote Received'

  return embed
}
