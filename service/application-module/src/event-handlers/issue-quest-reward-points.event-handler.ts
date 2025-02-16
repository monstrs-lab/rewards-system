import type { IEventHandler }                 from '@nestjs/cqrs'

import { Logger }                             from '@monstrs/logger'
import { EventsHandler }                      from '@nestjs/cqrs'
import { v4 as uuid }                         from 'uuid'

import { RewardPointsJournalEntryRepository } from '@rewards-system/domain-module'
import { RewardPointsJournalEntry }           from '@rewards-system/domain-module'
import { QuestRewardConfirmedEvent }          from '@rewards-system/domain-module'
import { QuestRewardRepository }              from '@rewards-system/domain-module'

@EventsHandler(QuestRewardConfirmedEvent)
export class IssueQuestRewardPointsEventHandler
  implements IEventHandler<QuestRewardConfirmedEvent>
{
  private readonly logger = new Logger(IssueQuestRewardPointsEventHandler.name)

  constructor(
    private readonly rewardPointsJournalEntryRepository: RewardPointsJournalEntryRepository,
    private readonly questRewardRepository: QuestRewardRepository
  ) {}

  async handle(event: QuestRewardConfirmedEvent): Promise<void> {
    const reward = await this.questRewardRepository.findById(event.questRewardId)

    if (!reward) {
      this.logger.fatal(`Reward with id '${event.questRewardId}' not found.`)

      return
    }

    await this.rewardPointsJournalEntryRepository.save(
      new RewardPointsJournalEntry()
        .create(uuid(), reward.recipientId, reward.id)
        .debit('Income:', reward.amount)
        .credit('Assets:Investments', reward.amount)
        .commitTransactions()
    )
  }
}
