import { Injectable } from '@nestjs/common'
import { ChatInputCommandInteraction } from 'discord.js'
import { QuoteApiService } from 'src/api/quote-api/quote-api.service'
import { InteractionEventBus } from 'src/slash-commands/providers/interaction-event-bus/interaction-event-bus'

@Injectable()
export class ReceiveHandlerService {
  constructor(private bus: InteractionEventBus, private api: QuoteApiService) {}

  private async handle(interaction: ChatInputCommandInteraction) {
    const { guildId } = interaction

    // TODO accept user id parameter
    const randomQuote = await this.api.getRandomQuote(guildId)

    const user = interaction.options.getUser('user')
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
      content: JSON.stringify(randomQuote),
    })
    await this.api.receive({
      serverId: guildId,
      channelId: interaction.channelId,
      quoteId: randomQuote.id,
      receiverId: interaction.user.id,
      messageId: reply.id,
    })
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
