import { Injectable } from '@nestjs/common'
import { ChatInputCommandInteraction, Client } from 'discord.js'
import { ABOUT_COMMAND_NAME } from 'scripts/command-registration/command-defs/about.command'
import {
  WISDOM_ABOUT_SUBCOMMAND_NAME,
  WISDOM_COMMAND_NAME,
} from 'scripts/command-registration/command-defs/wisdom.subcommands'
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
      if (!interaction.isChatInputCommand()) {
        return
      }

      if (
        interaction.commandName === ABOUT_COMMAND_NAME ||
        (interaction.commandName === WISDOM_COMMAND_NAME &&
          interaction.options.getSubcommand() === WISDOM_ABOUT_SUBCOMMAND_NAME)
      ) {
        this.handle(interaction)
      }
    })
  }
}
