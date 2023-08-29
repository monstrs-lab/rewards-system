export class CreateAndConfirmReferralOperationCommand {
  constructor(
    public readonly referralOperationId: string,
    public readonly referralProgram: string,
    public readonly referrerId: string,
    public readonly sourceId: string,
    public readonly sourceType: string,
    public readonly amount: number
  ) {}
}
