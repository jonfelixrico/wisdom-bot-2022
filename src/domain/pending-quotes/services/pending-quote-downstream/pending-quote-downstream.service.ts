import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { debounceTime, groupBy, mergeMap, Subject } from 'rxjs'
import { sprintf } from 'sprintf'
import { PendingQuoteApiService } from 'src/api/pending-quote-api/pending-quote-api.service'

@Injectable()
export class PendingQuoteDownstreamService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(PendingQuoteDownstreamService.name)

  private subject = new Subject<string>()

  constructor(private api: PendingQuoteApiService) {}

  private async handle(quoteId: string) {
    const quoteData = await this.api.get({ quoteId })
    if (!quoteData) {
      this.LOGGER.warn(sprintf('Did not find pending quote %s', quoteId))
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
      // render
    }
  }

  queueForProcessing(quoteId: string) {
    this.subject.next(quoteId)
  }

  onApplicationBootstrap() {
    this.subject
      .pipe(
        groupBy((id) => id),
        mergeMap((idGroup$) => {
          return idGroup$.pipe(debounceTime(5000))
        }),
      )
      .subscribe((quoteId) => this.handle(quoteId))
  }
}
