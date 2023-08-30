import type { ICommandHandler }           from '@nestjs/cqrs'

import assert                             from 'node:assert'

import { CommandHandler }                 from '@nestjs/cqrs'

import { RewardProgramRepository }        from '@rewards-system/domain-module'

import { DeleteRewardProgramRuleCommand } from '../../commands/index.js'

@CommandHandler(DeleteRewardProgramRuleCommand)
export class DeleteRewardProgramRuleCommandHandler
  implements ICommandHandler<DeleteRewardProgramRuleCommand, void>
{
  constructor(private readonly rewardProgramRepository: RewardProgramRepository) {}

  async execute(command: DeleteRewardProgramRuleCommand): Promise<void> {
    const rewardProgram = await this.rewardProgramRepository.findById(command.rewardProgramId)

    assert.ok(rewardProgram, `Reward program with id '${command.rewardProgramId}' not found`)
    assert.ok(
      rewardProgram.rules.find((rule) => rule.id === command.rewardProgramRuleId),
      `Reward program rule with id '${command.rewardProgramRuleId}' not found`
    )

    await this.rewardProgramRepository.save(rewardProgram.deleteRule(command.rewardProgramRuleId))
  }
}
