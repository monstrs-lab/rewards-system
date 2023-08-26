import type { TopLevelCondition } from '@referral-programs/domain-module'

export class UpdateReferralProgramRuleCommand {
  constructor(
    public readonly referralProgramRuleId: string,
    public readonly referralProgramId: string,
    public readonly order: number,
    public readonly name: string,
    public readonly conditions: TopLevelCondition,
    public readonly fields: Array<{
      conditions: TopLevelCondition
      percentage: number
    }>
  ) {}
}
