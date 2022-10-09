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
        messageId: null,
        content: interaction.options.getString('quote'),
      })

      interaction.reply({
        ephemeral: true,
        content: 'Ogey 👍',
      })

      this.LOGGER.log(
        `Created quote ${quoteId} from interaction ${interaction.id}`,
      )
    } catch (e) {
      this.LOGGER.error(e.message)
      interaction.reply({
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
