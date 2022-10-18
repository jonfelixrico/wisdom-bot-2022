import { Injectable, Logger } from '@nestjs/common'
import { Client, User } from 'discord.js'

@Injectable()
export class UserAvatarService {
  private readonly LOGGER = new Logger(UserAvatarService.name)

  constructor(private client: Client) {}

  async getUrl(userId: string) {
    let user: User
    try {
      user = await this.client.users.fetch(userId)
    } catch (e) {
      this.LOGGER.error(
        `Error encountered while trying to retrieve the user data for id ${userId}`,
        e,
      )
      return null
    }

    try {
      return await user.displayAvatarURL()
    } catch (e) {
      this.LOGGER.error(
        `Error encountered while trying to retrieve the avatar URL for user ${userId}`,
        e,
      )
      return null
    }
  }
}
