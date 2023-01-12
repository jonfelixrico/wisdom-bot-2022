import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  Guild,
  InteractionReplyOptions,
} from 'discord.js'
import { RECEIVE_COMMAND_NAME } from 'scripts/command-registration/command-defs/receive.command'
import {
  WISDOM_COMMAND_NAME,
  WISDOM_RECEIVE_SUBCOMMAND_NAME,
} from 'scripts/command-registration/command-defs/wisdom.subcommands'
import { sprintf } from 'sprintf'
import { QuoteApiService } from 'src/api/quote-api/quote-api.service'
import {
  generateErrorReply,
  generateReply,
  ReplyData,
} from './receive-presentation-util'

@Injectable()
export class ReceiveHandlerService {
  private readonly LOGGER = new Logger(ReceiveHandlerService.name)

  constructor(
    private api: QuoteApiService,
    private client: Client,
    private cfg: ConfigService,
  ) {}

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

  private get isPanelButtonEnabled(): boolean {
    return this.cfg.get<boolean>('PANEL_ENABLE_RECEIVE_BUTTON') ?? false
  }

  private generatePanelLinkButton(serverId: string, quoteId: string) {
    const url = new URL(
      sprintf(this.cfg.getOrThrow<string>('PANEL_RECEIVE_PREVIEW_PATH'), {
        serverId,
        quoteId,
      }),
      this.cfg.getOrThrow<string>('PANEL_BASE_URL'),
    ).toString()

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel('Show in the Panel')
        .setStyle(ButtonStyle.Link)
        .setURL(url),
    )
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
      year: new Date(randomQuote.submitDt).getFullYear(),

      receiverIconUrl: (await interaction.user.displayAvatarURL()) || undefined,
      quoteAuthorIconUrl: (await author.displayAvatarURL()) || undefined,
    }

    const options: InteractionReplyOptions = {
      embeds: [generateReply(responseData)],
    }

    if (this.isPanelButtonEnabled) {
      options.components = [
        this.generatePanelLinkButton(guildId, randomQuote.id),
      ]
    }

    const reply = await interaction.reply({
      fetchReply: true,
      ...options,
    })

    try {
      await this.api.receive({
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
        interaction.commandName === RECEIVE_COMMAND_NAME ||
        (interaction.commandName === WISDOM_COMMAND_NAME &&
          interaction.options.getSubcommand() ===
            WISDOM_RECEIVE_SUBCOMMAND_NAME)
      ) {
        this.handle(interaction)
      }
    })
  }
}
