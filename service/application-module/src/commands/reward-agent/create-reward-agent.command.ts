export class CreateRewardAgentCommand {
  constructor(
    public readonly id: string,
    public readonly referralCode?: string
  ) {}
}
