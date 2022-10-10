import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ChatInputCommandInteraction } from 'discord.js'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { InteractionEventBus } from 'src/slash-commands/providers/interaction-event-bus/interaction-event-bus'

@Injectable()
export class SubmitHandlerService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(SubmitHandlerService.name)

  constructor(
    private bus: InteractionEventBus,
    private api: PendingQuoteApiService,
  ) {}

  private async handle(interaction: ChatInputCommandInteraction) {
    try {
      const { quoteId } = await this.api.submit({
        authorId: interaction.options.getUser('author').id,
        submitterId: interaction.user.id,
        channelId: interaction.channelId,
        serverId: interaction.guildId,
        content: interaction.options.getString('quote'),
      })

      this.LOGGER.log(
        `Created quote ${quoteId} from interaction ${interaction.id}`,
      )

      // TODO implement a proper response
      const message = await interaction.reply({
        content: 'Submitted quote',
        fetchReply: true,
      })

      await this.api.finalizeMessageId({
        serverId: interaction.guildId,
        messageId: message.id,
        quoteId,
      })

      this.LOGGER.debug(`Finalized the message id for quote ${quoteId}`)
    } catch (e) {
      this.LOGGER.error(e.message)
      await interaction.reply({
        ephemeral: true,
        content:
          'Oops! Something went wrong while processing your submission. Try again later maybe?',
      })
    }
  }

  onApplicationBootstrap() {
    this.bus.subscribe((interaction) => {
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
