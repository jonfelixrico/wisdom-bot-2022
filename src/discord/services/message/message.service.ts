import { Injectable, Logger } from '@nestjs/common'
import { Channel, Client } from 'discord.js'

interface Params {
  serverId: string
  channelId: string
  messageId: string
}

@Injectable()
export class MessageService {
  private readonly LOGGER = new Logger(MessageService.name)

  constructor(private client: Client) {}

  async getMessage({ messageId, channelId }: Params) {
    const { LOGGER } = this

    let channel: Channel
    try {
      /*
       * TODO once sharding is implemented, we have to switch to retrieving the server first, then the channel.
       * See note in https://discord.js.org/#/docs/discord.js/main/class/Client?scrollTo=channels
       */
      await this.client.channels.fetch(channelId)
      if (!channel.isTextBased()) {
        LOGGER.debug(
          `Tried to get message ${messageId} from channel ${channelId}, but the latter is not a text channel`,
        )
        return null
      }
    } catch (e) {
      LOGGER.error(
        `Error encountered while trying to get channel ${channelId}`,
        e,
      )
      return null
    }

    try {
      return await channel.messages.fetch(messageId)
    } catch (e) {
      LOGGER.error(
        `Error encountered while trying to fetch message ${messageId}`,
      )
      return null
    }
  }
}
