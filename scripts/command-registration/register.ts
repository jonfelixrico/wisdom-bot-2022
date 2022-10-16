import { ABOUT_COMMAND } from './command-defs/about.command'
import { RECEIVE_COMMAND } from './command-defs/receive.command'
import { SUBMIT_COMMAND } from './command-defs/submit.command'
import { WISDOM_SUBCOMMANDS } from './command-defs/wisdom.subcommands'
import { sendToApi } from './executor'
import { CommandBuilder } from './types'

const commands: CommandBuilder[] = [
  ABOUT_COMMAND,
  RECEIVE_COMMAND,
  SUBMIT_COMMAND,
  WISDOM_SUBCOMMANDS,
]

console.log('Registering the following:')
for (const command of commands) {
  console.log(`* ${command.name}`)
}
sendToApi(...commands)
