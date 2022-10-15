export abstract class MessageIdWhitelist {
  abstract add(messageId: string): Promise<void>
  abstract remove(messageId: string): Promise<void>
  abstract contains(messageId: string): Promise<boolean>
}
