import { Injectable, Logger } from '@nestjs/common'
import { Client } from 'discord.js'
import { concatMap, debounceTime, from, groupBy, mergeMap, Subject } from 'rxjs'
import { GetPendingQuoteRespDto } from 'src/api/pending-quote-api/dto/get-pending-quote-dto.interface'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { PendingQuoteMessageGeneratorService } from '../pending-quote-message-generator/pending-quote-message-generator.service'

@Injectable()
export class PendingQuoteDownstreamService {
  private readonly LOGGER = new Logger(PendingQuoteDownstreamService.name)

  private subject = new Subject<string>()

  constructor(
    private api: PendingQuoteApiService,
    private client: Client,
    private msgGen: PendingQuoteMessageGeneratorService,
  ) {
    this.initListener()
  }

  private async getMessage(channelId: string, messageId: string) {
    const channel = await this.client.channels.fetch(channelId)
    if (!channel.isTextBased()) {
      return null
    }

    return await channel.messages.fetch(messageId)
  }

  private async handleOngoing(dto: GetPendingQuoteRespDto) {
    const { LOGGER } = this

    const { id } = dto

    LOGGER.debug(`Updating message for ongoing quote ${id}`)
    try {
      const message = await this.getMessage(dto.channelId, dto.messageId)
      if (!message) {
        return
      }

      await message.edit(
        await this.msgGen.generateForOngoing({
          ...dto,
          year: new Date(dto.submitDt).getFullYear(),
        }),
      )

      LOGGER.debug(`Re-rendered the message for quote ${id}`)
    } catch (e) {
      LOGGER.error(
        `Error encountered while re-rendering the message of quote ${id}`,
        e,
      )
    }
  }

  private async handle(quoteId: string) {
    const quoteData = await this.api.get({ quoteId })
    if (!quoteData) {
      this.LOGGER.warn(`Did not find pending quote ${quoteId}`)
      return
    }

    if (new Date() > new Date(quoteData.expirationDt)) {
      // do expiration processing
      // render
    } else if (
      // check if quote has reached enough numbers of view
      quoteData.requiredVoteCount ===
      Object.values(quoteData?.votes ?? {}).length
    ) {
      // send finalization API call
      // render
    } else {
      await this.handleOngoing(quoteData)
    }
  }

  private async handleWrapped(quoteId: string) {
    this.LOGGER.debug(`Handling ${quoteId}`)
    try {
      await this.handle(quoteId)
    } catch (e) {
      this.LOGGER.error(`Uncaught exception while processing ${quoteId}`, e)
    }
  }

  queueForProcessing(quoteId: string) {
    this.subject.next(quoteId)
    this.LOGGER.debug(`Queued quote ${quoteId}`)
  }

  private initListener() {
    this.subject
      .pipe(
        groupBy((id) => id),
        mergeMap((idGroup$) => {
          return idGroup$.pipe(
            debounceTime(5000),
            concatMap((id) => from(this.handleWrapped(id))),
          )
        }),
      )
      .subscribe() // need to subscribe or else the handler will not be called
  }
}
