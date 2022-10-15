import { Provider } from '@nestjs/common'
import { Client } from 'discord.js'
import { InteractionEventBus } from './interaction-event-bus'

export const INTERACTION_EVENT_BUS_PROVIDER: Provider = {
  provide: InteractionEventBus,
  inject: [Client],
  useFactory: (client: Client) => {
    const eventBus = new InteractionEventBus()
    client.on('interactionCreate', (interaction) => {
      eventBus.next(interaction)
    })
    return eventBus
  },
}
