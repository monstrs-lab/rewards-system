export class AddReferralAgentMetadataCommand {
  constructor(
    public readonly referralAgentId: string,
    public readonly metadata: Record<string, any>
  ) {}
}
