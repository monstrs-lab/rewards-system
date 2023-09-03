import type { RewardAgent } from '@rewards-system/domain-module'
import type { JsonValue }   from '@bufbuild/protobuf'

import { Struct }           from '@bufbuild/protobuf'

import * as rpc             from '@rewards-system/rewards-rpc/abstractions'

export class RewardAgentSerializer extends rpc.RewardAgent {
  constructor(private readonly rewardAgent: RewardAgent) {
    super()
  }

  get id(): string {
    return this.rewardAgent.id
  }

  get code(): string {
    return this.rewardAgent.code
  }

  get parentId(): string | undefined {
    return this.rewardAgent.parentId
  }

  get metadata(): Struct {
    return Struct.fromJson(this.rewardAgent.metadata as JsonValue)
  }
}
