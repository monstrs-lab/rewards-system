export class CreateReferralProgramCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly percentage: number
  ) {}
}
