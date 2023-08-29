export class CreateReferralProgramCommand {
  constructor(
    public readonly referralProgramId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly percentage: number
  ) {}
}
