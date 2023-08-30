import type { IEventHandler }                   from '@nestjs/cqrs'

import { EventsHandler }                        from '@nestjs/cqrs'
import { Logger }                               from '@monstrs/logger'
import { v4 as uuid }                           from 'uuid'

import { ReferralPointsJournalEntryRepository } from '@referral-programs/domain-module'
import { ReferralPointsJournalEntryFactory }    from '@referral-programs/domain-module'
import { ReferralProfitConfirmedEvent }         from '@referral-programs/domain-module'
import { ReferralProfitRepository }             from '@referral-programs/domain-module'

@EventsHandler(ReferralProfitConfirmedEvent)
export class IssueReferralPointsEventHandler
  implements IEventHandler<ReferralProfitConfirmedEvent>
{
  private readonly logger = new Logger(IssueReferralPointsEventHandler.name)

  constructor(
    private readonly referralPointsJournalEntryRepository: ReferralPointsJournalEntryRepository,
    private readonly referralPointsJournalEntryFactory: ReferralPointsJournalEntryFactory,
    private readonly referralProfitRepository: ReferralProfitRepository
  ) {}

  async handle(event: ReferralProfitConfirmedEvent): Promise<void> {
    const referralProfit = await this.referralProfitRepository.findById(event.referralProfitId)

    if (!referralProfit) {
      this.logger.fatal(`Referral profit with id '${event.referralProfitId}' not found.`)

      return
    }

    await this.referralPointsJournalEntryRepository.save(
      this.referralPointsJournalEntryFactory
        .create()
        .create(uuid(), referralProfit.agentId, referralProfit.id)
        .debit('Income:Profit', referralProfit.profit)
        .credit('Assets:Investments', referralProfit.profit)
        .commitTransactions()
    )
  }
}
