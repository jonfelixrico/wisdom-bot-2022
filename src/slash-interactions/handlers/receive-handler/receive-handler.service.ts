import { Injectable, Logger } from '@nestjs/common'
import { ChatInputCommandInteraction, Client, Guild } from 'discord.js'
import { QuoteApiService } from 'src/api/quote-api/quote-api.service'
import {
  generateErrorReply,
  generateReply,
  ReplyData,
} from './receive-presentation-util'

@Injectable()
export class ReceiveHandlerService {
  private readonly LOGGER = new Logger(ReceiveHandlerService.name)

  constructor(private api: QuoteApiService, private client: Client) {}

  private async getUser(guild: Guild, userId: string) {
    try {
      return await guild.members.fetch(userId)
    } catch (e) {
      this.LOGGER.warn(
        `Error encountered while trying to fetch user data for ${userId}`,
        e,
      )
      return null
    }
  }

  private async handle(interaction: ChatInputCommandInteraction) {
    const { guildId } = interaction

    const user = interaction.options.getUser('user')

    // TODO accept user id parameter
    const randomQuote = await this.api.getRandomQuote(guildId, user?.id)
    if (!randomQuote && user) {
      await interaction.reply({
        ephemeral: true,
        content: `${user} has no quotes eligible for receiving.`,
      })
      return
    } else if (!randomQuote) {
      await interaction.reply({
        ephemeral: true,
        content:
          "Your Discord server doesn't have any quotes eligible for receiving.",
      })
      return
    }

    const author = await this.getUser(interaction.guild, randomQuote.authorId)
    const responseData: ReplyData = {
      ...randomQuote,
      receiverId: interaction.user.id,
      year: new Date().getFullYear(),
      // TODO retrieve author icon url

      receiverIconUrl: (await interaction.user.displayAvatarURL()) || undefined,
      quoteAuthorIconUrl: (await author.displayAvatarURL()) || undefined,
    }

    const reply = await interaction.reply({
      fetchReply: true,
      embeds: [generateReply(responseData)],
    })

    try {
      await this.api.receive({
        serverId: guildId,
        channelId: interaction.channelId,
        quoteId: randomQuote.id,
        receiverId: interaction.user.id,
        messageId: reply.id,
      })
    } catch (e) {
      this.LOGGER.error(
        `Error encountered while trying to receive ${randomQuote.id}`,
        e,
      )

      reply.edit({
        embeds: [generateErrorReply(responseData)],
      })
    }
  }

  onApplicationBootstrap() {
    this.client.on('interactionCreate', (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return
      }

      if (
        interaction.commandName === 'receive' ||
        (interaction.commandName === 'wisdom' &&
          interaction.options.getSubcommand() === 'receive')
      ) {
        this.handle(interaction)
      }
    })
  }
}