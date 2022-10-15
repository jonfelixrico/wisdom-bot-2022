import { Injectable } from '@nestjs/common'
import { ChatInputCommandInteraction } from 'discord.js'
import { InteractionEventBus } from 'src/slash-interactions/providers/interaction-event-bus/interaction-event-bus'
import { AppInfoService } from 'src/system/app-info/app-info.service'

@Injectable()
export class AboutHandlerService {
  constructor(
    private bus: InteractionEventBus,
    private infoSvc: AppInfoService,
  ) {}

  private handle(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      ephemeral: true,
      content: this.infoSvc.version,
    })
  }

  onApplicationBootstrap() {
    this.bus.subscribe((interaction) => {
      if (
        interaction.isChatInputCommand() &&
        interaction.commandName === 'about'
      ) {
        this.handle(interaction)
      }
    })
  }
}
