export class DeleteReferralProgramRuleCommand {
  constructor(
    public readonly referralProgramRuleId: string,
    public readonly referralProgramId: string
  ) {}
}
