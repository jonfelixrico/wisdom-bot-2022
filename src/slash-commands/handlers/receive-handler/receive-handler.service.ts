import { Injectable, Logger } from '@nestjs/common'
import { ChatInputCommandInteraction } from 'discord.js'
import { QuoteApiService } from 'src/api/quote-api/quote-api.service'
import { InteractionEventBus } from 'src/slash-commands/providers/interaction-event-bus/interaction-event-bus'
import { generateReceiveResponse } from './receive-presentation-util'

@Injectable()
export class ReceiveHandlerService {
  private readonly LOGGER = new Logger(ReceiveHandlerService.name)

  constructor(private bus: InteractionEventBus, private api: QuoteApiService) {}

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

    const reply = await interaction.reply({
      fetchReply: true,
      embeds: [
        generateReceiveResponse({
          ...randomQuote,
          receiverId: interaction.user.id,
          year: new Date().getFullYear(),
        }),
      ],
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

      // TODO create a prettified reply
      reply.edit('A problem occurred while receiving the quote')
    }
  }

  onApplicationBootstrap() {
    this.bus.subscribe((interaction) => {
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
