import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ChatInputCommandInteraction, Client, Interaction } from 'discord.js'
import { sprintf } from 'sprintf'

function formatMessage(interaction: Interaction, content: string) {
  return sprintf(
    '[user:%s][interaction:%s][server:%s][channel:%s] %s',
    interaction.user.id,
    interaction.id,
    interaction.guild.id,
    interaction.channel.id,
    content,
  )
}

@Injectable()
export class InteractionLoggerService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(InteractionLoggerService.name)

  constructor(private client: Client) {}

  private handleCommand(interaction: ChatInputCommandInteraction) {
    const { LOGGER } = this

    const subCommandGroup = interaction.options.getSubcommandGroup(false)
    const subCommand = interaction.options.getSubcommand(false)
    const command = interaction.commandName
    if (subCommandGroup) {
      LOGGER.verbose(
        formatMessage(
          interaction,
          sprintf(
            'Invoked command "%s %s %s"',
            command,
            subCommandGroup,
            subCommand,
          ),
        ),
      )
    } else if (subCommand) {
      LOGGER.verbose(
        formatMessage(
          interaction,
          sprintf('Invoked command "%s %s"', command, subCommand),
        ),
      )
    } else {
      LOGGER.verbose(
        formatMessage(interaction, sprintf('Invoked command "%s"', command)),
      )
    }
  }

  onApplicationBootstrap() {
    const { LOGGER } = this

    LOGGER.debug('Interaction logger is now ready.')

    this.client.on('interactionCreate', (interaction) => {
      if (interaction.isButton()) {
        LOGGER.verbose(
          formatMessage(
            interaction,
            sprintf(
              'Clicked on button (type %s) with custom id %s with label %s',
              interaction.component.type,
              interaction.customId,
              interaction.component.label,
            ),
          ),
        )
      } else if (interaction.isChatInputCommand()) {
        this.handleCommand(interaction)
      }
    })
  }
}
