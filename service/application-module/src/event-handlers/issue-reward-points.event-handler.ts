import type { IEventHandler }                 from '@nestjs/cqrs'

import { Logger }                             from '@monstrs/logger'
import { EventsHandler }                      from '@nestjs/cqrs'
import { v4 as uuid }                         from 'uuid'

import { RewardPointsJournalEntryRepository } from '@rewards-system/domain-module'
import { RewardPointsJournalEntry }           from '@rewards-system/domain-module'
import { RewardConfirmedEvent }               from '@rewards-system/domain-module'
import { RewardRepository }                   from '@rewards-system/domain-module'

@EventsHandler(RewardConfirmedEvent)
export class IssueRewardPointsEventHandler implements IEventHandler<RewardConfirmedEvent> {
  private readonly logger = new Logger(IssueRewardPointsEventHandler.name)

  constructor(
    private readonly rewardPointsJournalEntryRepository: RewardPointsJournalEntryRepository,
    private readonly rewardRepository: RewardRepository
  ) {}

  async handle(event: RewardConfirmedEvent): Promise<void> {
    const reward = await this.rewardRepository.findById(event.rewardId)

    if (!reward) {
      this.logger.fatal(`Reward with id '${event.rewardId}' not found.`)

      return
    }

    await this.rewardPointsJournalEntryRepository.save(
      new RewardPointsJournalEntry()
        .create(uuid(), reward.agentId, reward.id)
        .debit('Income:', reward.profit)
        .credit('Assets:Investments', reward.profit)
        .commitTransactions()
    )
  }
}
