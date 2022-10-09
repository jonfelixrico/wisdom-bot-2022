import { Module } from '@nestjs/common'
import { SlashCommandsModule } from './slash-commands/slash-commands.module'

@Module({
  imports: [SlashCommandsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
