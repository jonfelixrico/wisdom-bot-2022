import { Injectable, Logger } from '@nestjs/common'
import { sprintf } from 'sprintf-js'
import { MessageIdWhitelist } from '../message-id-whitelist.abstract'

@Injectable()
export class MessageIdWhitelistImplService extends MessageIdWhitelist {
  private readonly LOGGER = new Logger(MessageIdWhitelistImplService.name)

  private whitelist = new Set<string>()

  async add(messageId: string): Promise<void> {
    this.whitelist.add(messageId)
    this.LOGGER.debug(sprintf('Added id %s', messageId))
  }

  async remove(messageId: string): Promise<void> {
    this.whitelist.delete(messageId)
    this.LOGGER.debug(sprintf('Removed id %s', messageId))
  }

  async contains(messageId: string): Promise<boolean> {
    return this.whitelist.has(messageId)
  }
}
