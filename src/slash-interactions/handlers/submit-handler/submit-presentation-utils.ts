import {
  APIActionRowComponent,
  APIButtonComponentWithCustomId,
  APIEmbed,
  ButtonStyle,
  ComponentType,
  MessageEditOptions,
} from 'discord.js'

const SPACE_CHARACTER = '\u200B'
interface Data {
  serverId: string
  content: string
  authorId: string
  year: number
  submitterId: string
  submitterIconUrl?: string
  authorIconUrl?: string
}

export function generateEmbed(data: Data) {
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

export function generateErrorEmbed(data: Data) {
  const embed = generateEmbed(data)

  embed.fields = [
    {
      name: SPACE_CHARACTER,
      value: '⚠️ An error was encountered, so this submission was not saved',
    },
  ]
  embed.author.name = '⚠️ Quote Submitted'

  return embed
}

interface PendingData extends Data {
  requiredVoteCount: number
  id: string
}

function createUpvoteButton(
  quoteId: string,
): APIActionRowComponent<APIButtonComponentWithCustomId> {
  return {
    components: [
      {
        style: ButtonStyle.Success,
        custom_id: `vote/${quoteId}`,
        type: ComponentType.Button,
        label: '👍 Upvote',
      },
    ],
    type: ComponentType.ActionRow,
  }
}

export function generatePendingMessage(data: PendingData): MessageEditOptions {
  const embed = generateEmbed(data)

  embed.fields = [
    {
      name: SPACE_CHARACTER,
      value: `This quote needs **${data.requiredVoteCount}** upvotes to be approved`,
    },
  ]

  return {
    embeds: [embed],
    components: [createUpvoteButton(data.id)],
  }
}
