import type { ICommandHandler }          from '@nestjs/cqrs'

import assert                            from 'node:assert'

import { CommandHandler }                from '@nestjs/cqrs'

import { RewardOperationRepository }     from '@rewards-system/domain-module'
import { RewardRepository }              from '@rewards-system/domain-module'

import { ConfirmRewardOperationCommand } from '../../commands/index.js'

@CommandHandler(ConfirmRewardOperationCommand)
export class ConfirmRewardOperationCommandHandler
  implements ICommandHandler<ConfirmRewardOperationCommand, void>
{
  constructor(
    private readonly rewardOperationRepository: RewardOperationRepository,
    private readonly rewardRepository: RewardRepository
  ) {}

  async execute(command: ConfirmRewardOperationCommand): Promise<void> {
    const rewardOperation = await this.rewardOperationRepository.findById(command.rewardOperationId)

    assert.ok(rewardOperation, `Reward operation with id '${command.rewardOperationId}' not found`)

    const rewards = await this.rewardRepository.findByOperationId(rewardOperation.id)

    await this.rewardOperationRepository.save(rewardOperation.confirm())

    for await (const reward of rewards) {
      await this.rewardRepository.save(reward.confirm())
    }
  }
}
