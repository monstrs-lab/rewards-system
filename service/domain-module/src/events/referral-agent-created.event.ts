export class ReferralAgentCreatedEvent {
  constructor(
    public readonly referralAgentId: string,
    public readonly code: string,
    public readonly parentId?: string
  ) {}
}
