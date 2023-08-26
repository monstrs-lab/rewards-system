export class ReferralProgramUpdatedEvent {
  constructor(
    public readonly referralProgramId: string,
    public readonly name: string,
    public readonly percentage: number
  ) {}
}
