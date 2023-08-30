import type { IEventHandler }                               from '@nestjs/cqrs'

import { EventsHandler }                                    from '@nestjs/cqrs'

import { RewardPointsJournalEntryRepository }               from '@rewards-system/domain-module'
import { RewardPointsBalanceFactory }                       from '@rewards-system/domain-module'
import { RewardPointsJournalEntryTransactionCommitedEvent } from '@rewards-system/domain-module'
import { RewardPointsBalanceRepository }                    from '@rewards-system/domain-module'

@EventsHandler(RewardPointsJournalEntryTransactionCommitedEvent)
export class UpdateRewardPointsBalanceEventHandler
  implements IEventHandler<RewardPointsJournalEntryTransactionCommitedEvent>
{
  constructor(
    private readonly rewardPointsJournalEntryRepository: RewardPointsJournalEntryRepository,
    private readonly rewardPointsBalanceRepository: RewardPointsBalanceRepository,
    private readonly rewardPointsBalanceFactory: RewardPointsBalanceFactory
  ) {}

  async handle(event: RewardPointsJournalEntryTransactionCommitedEvent): Promise<void> {
    const amount = await this.rewardPointsJournalEntryRepository.calculateBookAccountBalance(
      event.bookId,
      'Assets:Investments'
    )
    let balance = await this.rewardPointsBalanceRepository.findById(event.bookId)

    if (!balance) {
      balance = this.rewardPointsBalanceFactory.create().create(event.bookId)
    }

    await this.rewardPointsBalanceRepository.save(balance.update(amount))
  }
}
