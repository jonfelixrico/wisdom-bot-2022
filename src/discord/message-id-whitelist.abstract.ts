/**
 * The intention behind this class is to allow the Discord-related services to know which messages to entertain,
 * and which messages to ignore.
 *
 * This is part of the efforts to optimize performance.
 */
export abstract class MessageIdWhitelist {
  abstract add(messageId: string): Promise<void>
  abstract remove(messageId: string): Promise<void>
  abstract contains(messageId: string): Promise<boolean>
}
