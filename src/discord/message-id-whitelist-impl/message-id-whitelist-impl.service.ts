import { Injectable } from '@nestjs/common'
import { MessageIdWhitelist } from '../message-id-whitelist.abstract'

@Injectable()
export class MessageIdWhitelistImplService extends MessageIdWhitelist {
  private whitelist = new Set<string>()

  async add(messageId: string): Promise<void> {
    this.whitelist.add(messageId)
  }

  async remove(messageId: string): Promise<void> {
    this.whitelist.delete(messageId)
  }

  async contains(messageId: string): Promise<boolean> {
    return this.whitelist.has(messageId)
  }
}
