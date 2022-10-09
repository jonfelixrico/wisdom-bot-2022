import { Injectable } from '@nestjs/common'
import { ChatInputCommandInteraction } from 'discord.js'
import { InteractionEventBus } from 'src/slash-commands/providers/interaction-event-bus/interaction-event-bus'

@Injectable()
export class ReceiveHandlerService {
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
        interaction.commandName === 'receive' ||
        (interaction.commandName === 'wisdom' &&
          interaction.options.getSubcommand() === 'receive')
      ) {
        this.handle(interaction)
      }
    })
  }
}
