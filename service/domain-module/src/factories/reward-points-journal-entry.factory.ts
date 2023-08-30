import { Injectable }               from '@nestjs/common'

import { RewardPointsJournalEntry } from '../aggregates/index.js'

@Injectable()
export class RewardPointsJournalEntryFactory {
  create(): RewardPointsJournalEntry {
    return new RewardPointsJournalEntry()
  }
}
