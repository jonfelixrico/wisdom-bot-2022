import { Injectable, Logger } from '@nestjs/common'
import { concatMap, debounceTime, from, groupBy, mergeMap, Subject } from 'rxjs'
import { GetPendingQuoteRespDto } from 'src/api/pending-quote-api/dto/get-pending-quote-dto.interface'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'
import { MessageService } from 'src/discord/services/message/message.service'
import { PendingQuoteExpirationService } from '../pending-quote-expiration/pending-quote-expiration.service'
import { PendingQuoteMessageGeneratorService } from '../pending-quote-message-generator/pending-quote-message-generator.service'

@Injectable()
export class PendingQuoteDownstreamService {
  private readonly LOGGER = new Logger(PendingQuoteDownstreamService.name)

  private subject = new Subject<string>()

  constructor(
    private api: PendingQuoteApiService,
    private msgGen: PendingQuoteMessageGeneratorService,
    private msgSvc: MessageService,
    private expireSvc: PendingQuoteExpirationService,
  ) {
    this.initListener()
  }

  private async reRenderOngoing(dto: GetPendingQuoteRespDto) {
    const { LOGGER } = this

    const { id } = dto

    LOGGER.debug(`Updating message for ongoing quote ${id}`)
    try {
      const message = await this.msgSvc.getMessage(dto)
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

  async processApproval(quote: GetPendingQuoteRespDto) {
    const { LOGGER } = this
    LOGGER.debug(`Handling the approval of quote ${quote.id}`)

    try {
      // mark as approved in the API
      await this.api.finalizeStatus({
        quoteId: quote.id,
        status: 'APPROVED',
      })
      LOGGER.debug(`Finalized status of quote ${quote.id} as approved`)

      // update the original submit message to mark as approved
      const message = await this.msgSvc.getMessage(quote)
      await message.edit(
        await this.msgGen.generateForApproval({
          ...quote,
          year: new Date(quote.submitDt).getFullYear(),
        }),
      )

      // send a separate message to announce that it has been approved
      await message.channel.send({
        reply: {
          messageReference: message,
        },
        content: 'This quote has been approved 🎊🎉',
      })
    } catch (e) {
      LOGGER.error(
        `Error encountered while processing the approval of quote ${quote.id}`,
        e,
      )
    }
  }

  private async handle(quoteId: string) {
    this.LOGGER.debug(`Handling ${quoteId}`)
    try {
      const quoteData = await this.api.get({ quoteId })
      if (!quoteData) {
        this.LOGGER.warn(`Did not find pending quote ${quoteId}`)
        return
      }

      if (new Date() > new Date(quoteData.expirationDt)) {
        await this.expireSvc.processExpiration(quoteData)
      } else if (
        // check if quote has reached enough numbers of upvotes
        Object.values(quoteData.votes ?? {}).length >=
        quoteData.requiredVoteCount
      ) {
        await this.processApproval(quoteData)
      } else {
        await this.reRenderOngoing(quoteData)
      }
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
            // debounceTime + groupBy will debounce calls per quote id
            debounceTime(2500),
            // this is to handle debounce emits sequentially
            concatMap((id) => from(this.handle(id))),
          )
        }),
      )
      .subscribe() // need to subscribe or else the handler will not be called
  }
}
