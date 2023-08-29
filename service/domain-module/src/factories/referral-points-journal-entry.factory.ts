import { Injectable }                 from '@nestjs/common'

import { ReferralPointsJournalEntry } from '../aggregates/index.js'

@Injectable()
export class ReferralPointsJournalEntryFactory {
  create(): ReferralPointsJournalEntry {
    return new ReferralPointsJournalEntry()
  }
}
