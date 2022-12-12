import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ChatInputCommandInteraction, Client } from 'discord.js'
import { SUBMIT_COMMAND_NAME } from 'scripts/command-registration/command-defs/submit.command'
import {
  WISDOM_COMMAND_NAME,
  WISDOM_SUBMIT_SUBCOMMAND_NAME,
} from 'scripts/command-registration/command-defs/wisdom.subcommands'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { PendingQuoteMessageGeneratorService } from '../../services/pending-quote-message-generator/pending-quote-message-generator.service'

@Injectable()
export class SubmitHandlerService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(SubmitHandlerService.name)

  constructor(
    private api: PendingQuoteApiService,
    private client: Client,
    private msgGen: PendingQuoteMessageGeneratorService,
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
      year: new Date().getFullYear(),
    }

    const reply = await interaction.reply({
      ...(await this.msgGen.generateForSubmit(replyData)),
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
        await this.msgGen.generateForOngoing({
          ...replyData,
          id: quoteId,
          // TODO make dynamic instead of hardcoded
          requiredVoteCount: 3,

          // expected to be none for now
          votes: {},
        }),
      )
    } catch (e) {
      this.LOGGER.error('Error encountered while submitting: ', e)
      await reply.edit(await this.msgGen.generateForSubmitError(replyData))
      return
    }
  }

  async onApplicationBootstrap() {
    this.client.on('interactionCreate', (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return
      }

      if (
        interaction.commandName === SUBMIT_COMMAND_NAME ||
        (interaction.commandName === WISDOM_COMMAND_NAME &&
          interaction.options.getSubcommand() === WISDOM_SUBMIT_SUBCOMMAND_NAME)
      ) {
        this.handle(interaction)
      }
    })
  }
}
