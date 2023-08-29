export class CreateReferralAgentCommand {
  constructor(
    public readonly id: string,
    public readonly referralCode?: string
  ) {}
}
