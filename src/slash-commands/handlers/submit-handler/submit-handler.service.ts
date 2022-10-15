import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ChatInputCommandInteraction } from 'discord.js'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { MessageIdWhitelist } from 'src/discord/message-id-whitelist.abstract'
import { PendingQuotePresentationService } from 'src/presentation/pending-quote-presentation/pending-quote-presentation.service'
import { InteractionEventBus } from 'src/slash-commands/providers/interaction-event-bus/interaction-event-bus'

@Injectable()
export class SubmitHandlerService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(SubmitHandlerService.name)

  constructor(
    private bus: InteractionEventBus,
    private api: PendingQuoteApiService,
    private whitelist: MessageIdWhitelist,
    private presentation: PendingQuotePresentationService,
  ) {}

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
      // TODO find a better way to get the year
      year: new Date().getFullYear(),
    }

    const reply = await interaction.reply({
      embeds: [await this.presentation.generateEmbed(replyData)],
      fetchReply: true,
    })

    try {
      const { quoteId } = await this.api.submit({
        ...data,
        messageId: reply.id,
      })
      this.LOGGER.log(
        `Created quote ${quoteId} from interaction ${interaction.id}`,
      )

      await this.whitelist.add(reply.id)
      await reply.react('👍')
      await reply.edit({
        embeds: [
          await this.presentation.generatePendingEmbed({
            ...replyData,
            // TODO remove hardcode
            requiredVoteCount: 3,
          }),
        ],
      })
    } catch (e) {
      this.LOGGER.error('Error encountered while submitting: ', e)
      await reply.edit({
        embeds: [await this.presentation.generateSubmitErrorEmbed(replyData)],
      })
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
