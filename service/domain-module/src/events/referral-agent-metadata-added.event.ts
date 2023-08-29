export class ReferralAgentMetadataAddedEvent {
  constructor(
    public readonly referralAgentId: string,
    public readonly metadata: Record<string, any>
  ) {}
}
