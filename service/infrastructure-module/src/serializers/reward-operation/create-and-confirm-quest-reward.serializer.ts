import type { QuestReward }                    from '@rewards-system/domain-module'

import { CreateAndConfirmQuestRewardResponse } from '@rewards-system/rewards-rpc/abstractions'

import { QuestRewardSerializer }               from './quest-reward.serializer.js'

export class CreateAndConfirmQuestRewardSerializer extends CreateAndConfirmQuestRewardResponse {
  constructor(private readonly reward: QuestReward) {
    super()
  }

  get result(): QuestRewardSerializer {
    return new QuestRewardSerializer(this.reward)
  }
}
