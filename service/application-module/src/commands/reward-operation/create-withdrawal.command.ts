export class CreateWithdrawalCommand {
  constructor(
    public readonly withdrawalId: string,
    public readonly ownerId: string,
    public readonly amount: number
  ) {}
}
