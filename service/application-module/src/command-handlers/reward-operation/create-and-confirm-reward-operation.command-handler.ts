import type { ICommandHandler }                   from '@nestjs/cqrs'

import assert                                     from 'node:assert'

import { CommandHandler }                         from '@nestjs/cqrs'

import { RewardOperationFactory }                 from '@rewards-system/domain-module'
import { TransactionalRepository }                from '@rewards-system/domain-module'
import { RewardOperationRepository }              from '@rewards-system/domain-module'
import { RewardProgramRepository }                from '@rewards-system/domain-module'
import { RewardOperationSource }                  from '@rewards-system/domain-module'
import { RewardAgentRepository }                  from '@rewards-system/domain-module'

import { CreateAndConfirmRewardOperationCommand } from '../../commands/index.js'

@CommandHandler(CreateAndConfirmRewardOperationCommand)
export class CreateAndConfirmRewardOperationCommandHandler
  implements ICommandHandler<CreateAndConfirmRewardOperationCommand, void>
{
  constructor(
    private readonly transactionalRepository: TransactionalRepository,
    private readonly rewardOperationRepository: RewardOperationRepository,
    private readonly rewardProgramRepository: RewardProgramRepository,
    private readonly rewardOperationFactory: RewardOperationFactory,
    private readonly rewardAgentRepository: RewardAgentRepository
  ) {}

  async execute(command: CreateAndConfirmRewardOperationCommand): Promise<void> {
    const rewardProgram = await this.rewardProgramRepository.findByCode(command.rewardProgram)

    assert.ok(rewardProgram, `Reward program with code '${command.rewardProgram}' not found`)

    const rewardOperation = this.rewardOperationFactory
      .create()
      .create(
        command.rewardOperationId,
        rewardProgram.id,
        command.referrerId,
        RewardOperationSource.create(command.sourceId, command.sourceType),
        command.amount
      )
      .confirm()

    const referrer = await this.rewardAgentRepository.findById(rewardOperation.referrerId)

    if (referrer) {
      const recipients = await this.rewardAgentRepository.findRecipients(referrer)

      const rewards = await rewardProgram.calculate(rewardOperation, referrer, recipients)

      await this.transactionalRepository.saveOperationAndRewards(
        rewardOperation,
        rewards.map((reward) => reward.confirm())
      )
    } else {
      await this.rewardOperationRepository.save(rewardOperation)
    }
  }
}
