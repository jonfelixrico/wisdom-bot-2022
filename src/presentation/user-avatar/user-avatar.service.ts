import { Injectable, Logger } from '@nestjs/common'
import { Client, User } from 'discord.js'
import { sprintf } from 'sprintf-js'

@Injectable()
export class UserAvatarService {
  private readonly LOGGER = new Logger(UserAvatarService.name)

  constructor(private client: Client) {}

  async getAvatarUrl(userId: string) {
    const { LOGGER } = this

    let user: User
    try {
      user = await this.client.users.fetch(userId)
    } catch (e) {
      LOGGER.error(
        sprintf(
          'Error encountered while trying to fetch user data for user %s',
          userId,
        ),
        e,
      )
      return null
    }

    try {
      return await user.displayAvatarURL()
    } catch (e) {
      LOGGER.error(
        sprintf(
          'Error encountered while trying to fetch avatar URL for user %s',
          userId,
        ),
        e,
      )
    }
  }
}
