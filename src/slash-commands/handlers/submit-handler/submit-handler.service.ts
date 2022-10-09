import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ChatInputCommandInteraction } from 'discord.js'
import { InteractionEventBus } from 'src/slash-commands/providers/interaction-event-bus/interaction-event-bus'

@Injectable()
export class SubmitHandlerService implements OnApplicationBootstrap {
  constructor(private bus: InteractionEventBus) {}

  private handle(interaction: ChatInputCommandInteraction) {
    // TODO implement this
    console.debug(interaction)
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
