import { Injectable } from '@nestjs/common'
import { version } from 'package.json'

@Injectable()
export class AppInfoService {
  /**
   * Get the version of this bot.
   */
  get version(): string {
    return version
  }
}
