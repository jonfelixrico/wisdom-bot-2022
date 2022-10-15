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

@Injectable()
export class QuoteSubmitPresentationService {
  constructor(private avatarSvc: UserAvatarService) {}

  async generateReplyEmbed(data: Data) {
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

  async generateErrorReplyEmbed(data: Data) {
    const embed = await this.generateReplyEmbed(data)

    embed.fields = [
      {
        name: SPACE_CHARACTER,
        value: '⚠️ An error was encountered, so this submission was not saved',
      },
    ]
    embed.author.name = '⚠️ Quote Submitted'

    return embed
  }
}
