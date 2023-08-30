import type { ICommandHandler }           from '@nestjs/cqrs'

import assert                             from 'node:assert'

import { CommandHandler }                 from '@nestjs/cqrs'

import { RewardProgramRepository }        from '@rewards-system/domain-module'
import { RewardProgramConditions }        from '@rewards-system/domain-module'
import { RewardProgramField }             from '@rewards-system/domain-module'
import { RewardProgramRule }              from '@rewards-system/domain-module'

import { UpdateRewardProgramRuleCommand } from '../../commands/index.js'

@CommandHandler(UpdateRewardProgramRuleCommand)
export class UpdateRewardProgramRuleCommandHandler
  implements ICommandHandler<UpdateRewardProgramRuleCommand, void>
{
  constructor(private readonly rewardProgramRepository: RewardProgramRepository) {}

  async execute(command: UpdateRewardProgramRuleCommand): Promise<void> {
    const rewardProgram = await this.rewardProgramRepository.findById(command.rewardProgramId)

    assert.ok(rewardProgram, `Reward program with id '${command.rewardProgramId}' not found`)

    assert.ok(
      rewardProgram.rules.find((rule) => rule.id === command.rewardProgramRuleId),
      `Reward program rule with id '${command.rewardProgramRuleId}' not found`
    )

    await this.rewardProgramRepository.save(
      rewardProgram.updateRule(
        RewardProgramRule.create(
          command.rewardProgramRuleId,
          command.name,
          command.order,
          RewardProgramConditions.create(command.conditions),
          command.fields.map((field) =>
            RewardProgramField.create(
              field.percentage,
              RewardProgramConditions.create(field.conditions)
            ))
        )
      )
    )
  }
}
