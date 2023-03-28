import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { version } from 'package.json'
import { BUILD_VERSION } from 'src/env-vars.constants'

@Injectable()
export class AppInfoService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(AppInfoService.name)

  constructor(private cfg: ConfigService) {}

  /**
   * Get the version of this bot.
   */
  get version(): string {
    return this.cfg.get(BUILD_VERSION) || version
  }

  onApplicationBootstrap() {
    this.LOGGER.log(`Running on version ${this.version}`)
  }
}
