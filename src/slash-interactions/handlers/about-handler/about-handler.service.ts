import { Injectable } from '@nestjs/common'
import { ChatInputCommandInteraction, Client } from 'discord.js'
import { AppInfoService } from 'src/system/app-info/app-info.service'

@Injectable()
export class AboutHandlerService {
  constructor(private infoSvc: AppInfoService, private client: Client) {}

  private handle(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      ephemeral: true,
      content: this.infoSvc.version,
    })
  }

  onApplicationBootstrap() {
    this.client.on('interactionCreate', (interaction) => {
      if (
        interaction.isChatInputCommand() &&
        interaction.commandName === 'about'
      ) {
        this.handle(interaction)
      }
    })
  }
}
