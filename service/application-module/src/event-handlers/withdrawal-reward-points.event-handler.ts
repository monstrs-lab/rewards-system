import type { IEventHandler }                 from '@nestjs/cqrs'

import { Logger }                             from '@monstrs/logger'
import { EventsHandler }                      from '@nestjs/cqrs'
import { v4 as uuid }                         from 'uuid'

import { RewardPointsJournalEntryRepository } from '@rewards-system/domain-module'
import { WithdrawalRepository }               from '@rewards-system/domain-module'
import { RewardPointsJournalEntry }           from '@rewards-system/domain-module'
import { WithdrawalCreatedEvent }             from '@rewards-system/domain-module'

@EventsHandler(WithdrawalCreatedEvent)
export class WithdrawalRewardPointsEventHandler implements IEventHandler<WithdrawalCreatedEvent> {
  private readonly logger = new Logger(WithdrawalRewardPointsEventHandler.name)

  constructor(
    private readonly rewardPointsJournalEntryRepository: RewardPointsJournalEntryRepository,
    private readonly withdrawalRepository: WithdrawalRepository
  ) {}

  async handle(event: WithdrawalCreatedEvent): Promise<void> {
    const withdrawal = await this.withdrawalRepository.findById(event.withdrawalId)

    if (!withdrawal) {
      this.logger.fatal(`Withdrawal with id '${event.withdrawalId}' not found.`)

      return
    }

    await this.rewardPointsJournalEntryRepository.save(
      new RewardPointsJournalEntry()
        .create(uuid(), withdrawal.ownerId, withdrawal.id)
        .debit('Assets:Investments', withdrawal.amount)
        .credit('Expenses:Withdrawal', withdrawal.amount)
        .commitTransactions()
    )
  }
}
