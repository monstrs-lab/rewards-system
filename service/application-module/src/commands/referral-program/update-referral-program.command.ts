export class UpdateReferralProgramCommand {
  constructor(
    public readonly referralProgramId: string,
    public readonly name: string,
    public readonly percentage: number
  ) {}
}
