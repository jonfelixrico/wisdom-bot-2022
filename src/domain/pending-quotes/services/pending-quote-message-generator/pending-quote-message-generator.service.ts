import { Injectable } from '@nestjs/common'
import {
  APIActionRowComponent,
  APIButtonComponentWithCustomId,
  APIEmbed,
  ButtonStyle,
  ComponentType,
} from 'discord.js'
import { UserAvatarService } from 'src/discord/services/user-avatar/user-avatar.service'

const SPACE_CHARACTER = '\u200B'

interface Data {
  serverId: string
  content: string
  authorId: string
  year: number
  submitterId: string
}

interface PendingData extends Data {
  requiredVoteCount: number
  id: string
  votes: Record<string, Date | string>
}

@Injectable()
export class PendingQuoteMessageGeneratorService {
  constructor(private avatarSvc: UserAvatarService) {}

  private async generateEmbed(data: Data) {
    const embed: APIEmbed = {
      author: {
        name: 'Quote Submitted',
        icon_url: await this.avatarSvc.getUrl(data.submitterId),
      },

      description: [
        `**"${data.content}"**`,
        `- <@${data.authorId}>, ${data.year}`,
        '',
        `_Submitted by <@${data.submitterId}>_`,
      ].join('\n'),

      thumbnail: {
        url: await this.avatarSvc.getUrl(data.authorId),
      },
    }

    return embed
  }

  async generateForSubmit(data: Data) {
    const embed = await this.generateEmbed(data)
    return {
      embeds: [embed],
    }
  }

  async generateForSubmitError(data: Data) {
    const embed = await this.generateEmbed(data)

    embed.fields = [
      {
        name: SPACE_CHARACTER,
        value: '⚠️ An error was encountered, so this submission was not saved',
      },
    ]
    embed.author.name = '⚠️ Quote Submitted'

    return {
      embeds: [embed],
    }
  }

  private createUpvoteButton(
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

  async generateForOngoing(data: PendingData) {
    const embed = await this.generateEmbed(data)

    const votesAsArray = Object.entries(data.votes ?? [])
      .map(([userId, timestamp]) => {
        return {
          userId,
          timestamp: new Date(timestamp),
        }
      })
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    embed.fields = [
      {
        name: SPACE_CHARACTER,
        // TODO add text for indicating expiration
        value: `This quote needs **${Math.max(
          0,
          data.requiredVoteCount - votesAsArray.length,
        )}** upvotes to be approved`,
      },
    ]

    if (votesAsArray.length) {
      embed.fields.push({
        name: 'Upvotes',
        value: votesAsArray.map(({ userId }) => `- <@${userId}>`).join('\n'),
      })
    }

    return {
      embeds: [embed],
      components: [this.createUpvoteButton(data.id)],
    }
  }

  async generateForApproval(data: Data) {
    const embed = await this.generateEmbed(data)

    embed.fields = [
      {
        name: SPACE_CHARACTER,
        value: '✅ This quote has been accepted',
      },
    ]
    embed.author.name = '✅ Quote Submitted'

    return {
      embeds: [embed],
      components: [], // to clear the buttons from before
    }
  }
}
