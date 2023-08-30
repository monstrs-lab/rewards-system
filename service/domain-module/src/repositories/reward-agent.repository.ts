import type { Query }       from '@monstrs/query-types'

import type { RewardAgent } from '../aggregates/index.js'

export interface RewardAgentsQuery {
  id?: Query.IDType
}

export interface FindRewardAgentsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: RewardAgentsQuery
}

export interface FindRewardAgentsByQueryResult {
  rewardAgents: Array<RewardAgent>
  hasNextPage: boolean
}

export abstract class RewardAgentRepository {
  async findRecipients(agent: RewardAgent): Promise<Array<RewardAgent>> {
    const ancestors = await this.findAncestors(agent)

    return this.orderRecipients(
      agent,
      ancestors.filter((ancestor) => ancestor.id !== agent.id)
    )
  }

  private traverseRecipients(
    parent: RewardAgent,
    recipients: Record<string, RewardAgent>
  ): Array<RewardAgent> {
    if (!parent.parentId) {
      return []
    }

    const item = recipients[parent.parentId]

    if (!item) {
      return []
    }

    return [item, ...this.traverseRecipients(item, recipients)]
  }

  private orderRecipients(parent: RewardAgent, recipients: Array<RewardAgent>): Array<RewardAgent> {
    return this.traverseRecipients(
      parent,
      recipients.reduce(
        (result, item) => ({
          ...result,
          [item.id]: item,
        }),
        {}
      )
    )
  }

  abstract save(aggregate: RewardAgent): Promise<void>

  abstract findById(id: string): Promise<RewardAgent | undefined>

  abstract findByCode(code: string): Promise<RewardAgent | undefined>

  abstract findByQuery(query: FindRewardAgentsByQuery): Promise<FindRewardAgentsByQueryResult>

  abstract findDescendents(agent: RewardAgent): Promise<Array<RewardAgent>>

  abstract findAncestors(agent: RewardAgent): Promise<Array<RewardAgent>>
}
