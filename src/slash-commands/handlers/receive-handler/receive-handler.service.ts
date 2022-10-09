import { Injectable } from '@nestjs/common'
import { ChatInputCommandInteraction } from 'discord.js'
import { QuoteApiService } from 'src/api/quote-api/quote-api.service'
import { InteractionEventBus } from 'src/slash-commands/providers/interaction-event-bus/interaction-event-bus'

@Injectable()
export class ReceiveHandlerService {
  constructor(private bus: InteractionEventBus, private api: QuoteApiService) {}

  private async handle(interaction: ChatInputCommandInteraction) {
    const { guildId } = interaction
    const randomQuote = await this.api.getRandomQuote(guildId)

    if (!randomQuote) {
      await interaction.reply({
        ephemeral: true,
        content: 'Sorry, but your Discord server has no approved quotes yet.',
      })
      return
    }

    // TODO implement a proper response
    await interaction.reply(JSON.stringify(randomQuote))
    await this.api.receive({
      serverId: guildId,
      channelId: interaction.channelId,
      quoteId: randomQuote.id,
      receiverId: interaction.user.id,
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
