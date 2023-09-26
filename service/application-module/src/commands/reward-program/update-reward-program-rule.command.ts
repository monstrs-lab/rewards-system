import type { TopLevelCondition } from '@rewards-system/domain-module'

export class UpdateRewardProgramRuleCommand {
  constructor(
    public readonly rewardProgramRuleId: string,
    public readonly rewardProgramId: string,
    public readonly order: number,
    public readonly name: string,
    public readonly conditions: TopLevelCondition,
    public readonly fields: Array<{
      conditions: TopLevelCondition
      percentage: number
    }>
  ) {}
}
