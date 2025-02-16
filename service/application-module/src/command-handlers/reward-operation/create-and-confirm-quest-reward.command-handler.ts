import type { ICommandHandler }               from '@nestjs/cqrs'

import assert                                 from 'node:assert'

import { CommandHandler }                     from '@nestjs/cqrs'
import { BigNumber }                          from 'bignumber.js'

import { QuestReward }                        from '@rewards-system/domain-module'
import { QuestRewardSource }                  from '@rewards-system/domain-module'
import { QuestRewardRepository }              from '@rewards-system/domain-module'

import { CreateAndConfirmQuestRewardCommand } from '../../commands/index.js'

@CommandHandler(CreateAndConfirmQuestRewardCommand)
export class CreateAndConfirmQuestRewardCommandHandler
  implements ICommandHandler<CreateAndConfirmQuestRewardCommand, void>
{
  constructor(private readonly questRewardRepository: QuestRewardRepository) {}

  async execute(command: CreateAndConfirmQuestRewardCommand): Promise<void> {
    const exists = await this.questRewardRepository.findByRecipinetAndSource(
      command.recipientId,
      QuestRewardSource.create(command.sourceId, command.sourceType)
    )

    assert.ok(!exists, 'Quest reward allready exists')

    const questReward = new QuestReward()
      .create(
        command.questRewardId,
        command.recipientId,
        QuestRewardSource.create(command.sourceId, command.sourceType),
        new BigNumber(command.amount)
      )
      .confirm()

    await this.questRewardRepository.save(questReward)
  }
}
