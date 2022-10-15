import { Injectable } from '@nestjs/common'
import { APIEmbed } from 'discord.js'
import { UserAvatarService } from '../user-avatar/user-avatar.service'

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
}

@Injectable()
export class PendingQuotePresentationService {
  constructor(private avatarSvc: UserAvatarService) {}

  async generateEmbed(data: Data) {
    const embed: APIEmbed = {
      author: {
        name: 'Quote Submitted',
        icon_url: await this.avatarSvc.getAvatarUrl(data.submitterId),
      },

      description: [
        `**"${data.content}"**`,
        `- <@${data.authorId}>, ${data.year}`,
        '',
        `_Submitted by <@${data.submitterId}>_`,
      ].join('\n'),

      thumbnail: {
        url: await this.avatarSvc.getAvatarUrl(data.authorId),
      },
    }

    return embed
  }

  async generateSubmitErrorEmbed(data: Data) {
    const embed = await this.generateEmbed(data)

    embed.fields = [
      {
        name: SPACE_CHARACTER,
        value: '⚠️ An error was encountered, so this submission was not saved',
      },
    ]
    embed.author.name = '⚠️ Quote Submitted'

    return embed
  }

  async generateExpiredEmbed(data: Data) {
    const embed = await this.generateEmbed(data)

    embed.fields = [
      {
        name: SPACE_CHARACTER,
        value: '❌ The quote did not reach the required votes in time',
      },
    ]
    embed.author.name = '❌ Quote Submitted'

    return embed
  }

  async generatePendingEmbed(data: PendingData) {
    const embed = await this.generateEmbed(data)

    embed.fields = [
      {
        name: SPACE_CHARACTER,
        value: `This quote needs ${data.requiredVoteCount} 👍 reactions to be approved`,
      },
    ]

    return embed
  }

  async generateAcceptedEmbed(data: Data) {
    const embed = await this.generateEmbed(data)

    embed.fields = [
      {
        name: SPACE_CHARACTER,
        value: '✔️ This quote has been accepted',
      },
    ]
    embed.author.name = '✔️ Quote Submitted'

    return embed
  }
}
