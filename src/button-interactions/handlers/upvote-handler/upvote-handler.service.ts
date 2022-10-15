import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ButtonInteraction, CacheType, Client } from 'discord.js'
import { sprintf } from 'sprintf'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'

const VOTE_REGEXP = /^vote\/(.*)$/

@Injectable()
export class UpvoteHandlerService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(UpvoteHandlerService.name)

  constructor(private client: Client, private api: PendingQuoteApiService) {}

  private async handle(
    interaction: ButtonInteraction<CacheType>,
    quoteId: string,
  ) {
    const { LOGGER } = this

    await interaction.deferReply({
      ephemeral: true,
    })

    try {
      // TODO add checking to see if the user has already voted before
      await this.api.addVote({
        quoteId,
        serverId: interaction.guildId,
        userId: interaction.user.id,
      })
      LOGGER.log(
        sprintf('User %s has upvoted quote %s', interaction.user.id, quoteId),
      )

      // TODO emit event to update the quote

      await interaction.editReply('Your upvote has been recorded ✅')
    } catch (e) {
      if (e.response?.status === 403) {
        LOGGER.debug(
          sprintf(
            'Vote blocked -- user %s has already voted for quote %s',
            interaction.user.id,
            quoteId,
          ),
          e,
        )

        await interaction.editReply(
          'You have already upvoted this quote before!',
        )
        return
      }

      LOGGER.error(
        sprintf(
          'An error was encountered while processing the upvote of user %s for quote %s',
          interaction.user.id,
          quoteId,
        ),
        e,
      )
      await interaction.editReply(
        'Something went wrong while saving your upvote...',
      )
    }
  }

  onApplicationBootstrap() {
    this.client.on('interactionCreate', (interaction) => {
      if (!interaction.isButton()) {
        return
      }

      const match = VOTE_REGEXP.exec(interaction.customId)
      if (!match) {
        return
      }

      this.handle(interaction, match[1])
    })
  }
}
