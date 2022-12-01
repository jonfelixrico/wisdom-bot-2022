import { Injectable } from '@nestjs/common'
import { version } from 'package.json'

@Injectable()
export class BotInfoService {
  /**
   * Get the version of this bot.
   */
  get version(): string {
    return version
  }
}
