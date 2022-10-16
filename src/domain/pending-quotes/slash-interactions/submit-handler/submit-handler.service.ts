import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ChatInputCommandInteraction, Client } from 'discord.js'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import {
  generateErrorEmbed,
  generateEmbed,
  generatePendingMessage,
} from './submit-presentation-utils'

@Injectable()
export class SubmitHandlerService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(SubmitHandlerService.name)

  constructor(private api: PendingQuoteApiService, private client: Client) {}

  private async handle(interaction: ChatInputCommandInteraction) {
    const author = interaction.options.getUser('author')
    const data = {
      authorId: author.id,
      submitterId: interaction.user.id,
      channelId: interaction.channelId,
      serverId: interaction.guildId,
      content: interaction.options.getString('quote'),
    }

    const replyData = {
      ...data,
      year: new Date().getFullYear(),
      authorIconUrl: await author.displayAvatarURL(),
      submitterIconUrl: await interaction.user.displayAvatarURL(),
    }
    const reply = await interaction.reply({
      embeds: [generateEmbed(replyData)],
      fetchReply: true,
    })

    try {
      // TODO adjust endpoint to return full details
      const { quoteId } = await this.api.submit({
        ...data,
        messageId: reply.id,
      })
      this.LOGGER.log(
        `Created quote ${quoteId} from interaction ${interaction.id}`,
      )

      await reply.edit(
        generatePendingMessage({
          ...replyData,
          id: quoteId,
          // TODO make dynamic instead of hardcoded
          requiredVoteCount: 3,
        }),
      )
    } catch (e) {
      this.LOGGER.error('Error encountered while submitting: ', e)
      await reply.edit({
        embeds: [generateErrorEmbed(replyData)],
      })
      return
    }
  }

  onApplicationBootstrap() {
    this.client.on('interactionCreate', (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return
      }

      if (
        interaction.commandName === 'submit' ||
        (interaction.commandName === 'wisdom' &&
          interaction.options.getSubcommand() === 'submit')
      ) {
        this.handle(interaction)
      }
    })
  }
}
