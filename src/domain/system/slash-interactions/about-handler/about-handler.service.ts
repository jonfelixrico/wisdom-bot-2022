import { Injectable } from '@nestjs/common'
import { APIEmbed, ChatInputCommandInteraction, Client } from 'discord.js'
import { ABOUT_COMMAND_NAME } from 'scripts/command-registration/command-defs/about.command'
import {
  WISDOM_ABOUT_SUBCOMMAND_NAME,
  WISDOM_COMMAND_NAME,
} from 'scripts/command-registration/command-defs/wisdom.subcommands'
import { ApiInfoService } from 'src/api/api-info/api-info.service'
import { AppInfoService } from 'src/domain/system/services/app-info/app-info.service'

@Injectable()
export class AboutHandlerService {
  constructor(
    private infoSvc: AppInfoService,
    private client: Client,
    private apiInfoSvc: ApiInfoService,
  ) {}

  private async handle(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      embeds: [await this.generateContent()],
      ephemeral: true,
    })
  }

  private async generateContent(): Promise<APIEmbed> {
    return {
      author: {
        name: 'About the Bot',
      },

      description: [
        `**🤖 Bot version**: \`${this.infoSvc.version}\``,
        `**🖥️ Server version**: \`${await this.apiInfoSvc.getVersion()}\``,
      ].join('\n'),
    }
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
