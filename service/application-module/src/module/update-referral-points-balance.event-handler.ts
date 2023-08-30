import type { IEventHandler }                                 from '@nestjs/cqrs'

import { EventsHandler }                                      from '@nestjs/cqrs'

import { ReferralPointsJournalEntryRepository }               from '@referral-programs/domain-module'
import { ReferralPointsBalanceFactory }                       from '@referral-programs/domain-module'
import { ReferralPointsJournalEntryTransactionCommitedEvent } from '@referral-programs/domain-module'
import { ReferralPointsBalanceRepository }                    from '@referral-programs/domain-module'

@EventsHandler(ReferralPointsJournalEntryTransactionCommitedEvent)
export class UpdateReferralPointsBalanceEventHandler
  implements IEventHandler<ReferralPointsJournalEntryTransactionCommitedEvent>
{
  constructor(
    private readonly referralPointsJournalEntryRepository: ReferralPointsJournalEntryRepository,
    private readonly referralPointsBalanceRepository: ReferralPointsBalanceRepository,
    private readonly referralPointsBalanceFactory: ReferralPointsBalanceFactory
  ) {}

  async handle(event: ReferralPointsJournalEntryTransactionCommitedEvent): Promise<void> {
    const amount = await this.referralPointsJournalEntryRepository.calculateBookAccountBalance(
      event.bookId,
      'Assets:Investments'
    )
    let balance = await this.referralPointsBalanceRepository.findById(event.bookId)

    if (!balance) {
      balance = this.referralPointsBalanceFactory.create().create(event.bookId)
    }

    await this.referralPointsBalanceRepository.save(balance.update(amount))
  }
}
