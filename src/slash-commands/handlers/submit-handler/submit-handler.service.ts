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
    const message = await interaction.reply({
      content: 'Submitted quote (loading)',
      fetchReply: true,
    })

    try {
      const { quoteId } = await this.api.submit({
        authorId: interaction.options.getUser('author').id,
        submitterId: interaction.user.id,
        channelId: interaction.channelId,
        serverId: interaction.guildId,
        content: interaction.options.getString('quote'),
        messageId: message.id,
      })
      this.LOGGER.log(
        `Created quote ${quoteId} from interaction ${interaction.id}`,
      )
    } catch (e) {
      this.LOGGER.error('Error encountered while submitting: ', e)
      await message.edit(
        'An error was encountered while trying to submit the quote.',
      )
      return
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
