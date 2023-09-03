import type { ICommandHandler }         from '@nestjs/cqrs'

import assert                           from 'node:assert'

import { CommandHandler }               from '@nestjs/cqrs'

import { RewardOperationFactory }       from '@rewards-system/domain-module'
import { TransactionalRepository }      from '@rewards-system/domain-module'
import { RewardOperationRepository }    from '@rewards-system/domain-module'
import { RewardProgramRepository }      from '@rewards-system/domain-module'
import { RewardAgentRepository }        from '@rewards-system/domain-module'
import { RewardOperationSource }        from '@rewards-system/domain-module'

import { CreateRewardOperationCommand } from '../../commands/index.js'

@CommandHandler(CreateRewardOperationCommand)
export class CreateRewardOperationCommandHandler
  implements ICommandHandler<CreateRewardOperationCommand, void>
{
  constructor(
    private readonly transactionalRepository: TransactionalRepository,
    private readonly rewardOperationRepository: RewardOperationRepository,
    private readonly rewardProgramRepository: RewardProgramRepository,
    private readonly rewardOperationFactory: RewardOperationFactory,
    private readonly rewardAgentRepository: RewardAgentRepository
  ) {}

  async execute(command: CreateRewardOperationCommand): Promise<void> {
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

    await this.rewardOperationRepository.save(rewardOperation)

    const referrer = await this.rewardAgentRepository.findById(rewardOperation.referrerId)

    if (referrer) {
      const recipients = await this.rewardAgentRepository.findRecipients(referrer)

      const rewards = await rewardProgram.calculate(rewardOperation, referrer, recipients)

      await this.transactionalRepository.saveOperationAndRewards(rewardOperation, rewards)
    } else {
      await this.rewardOperationRepository.save(rewardOperation)
    }
  }
}
