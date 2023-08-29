import type { Query }         from '@monstrs/query-types'

import type { ReferralAgent } from '../aggregates/index.js'

export interface ReferralAgentsQuery {
  id?: Query.IDType
}

export interface FindReferralAgentsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: ReferralAgentsQuery
}

export interface FindReferralAgentsByQueryResult {
  referralAgents: Array<ReferralAgent>
  hasNextPage: boolean
}

export abstract class ReferralAgentRepository {
  async findRecipients(agent: ReferralAgent): Promise<Array<ReferralAgent>> {
    const ancestors = await this.findAncestors(agent)

    return this.orderRecipients(
      agent,
      ancestors.filter((ancestor) => ancestor.id !== agent.id)
    )
  }

  private traverseRecipients(
    parent: ReferralAgent,
    recipients: Record<string, ReferralAgent>
  ): Array<ReferralAgent> {
    if (!parent.parentId) {
      return []
    }

    const item = recipients[parent.parentId]

    if (!item) {
      return []
    }

    return [item, ...this.traverseRecipients(item, recipients)]
  }

  private orderRecipients(
    parent: ReferralAgent,
    recipients: Array<ReferralAgent>
  ): Array<ReferralAgent> {
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

  abstract save(aggregate: ReferralAgent): Promise<void>

  abstract findById(id: string): Promise<ReferralAgent | undefined>

  abstract findByCode(code: string): Promise<ReferralAgent | undefined>

  abstract findByQuery(query: FindReferralAgentsByQuery): Promise<FindReferralAgentsByQueryResult>

  abstract findDescendents(agent: ReferralAgent): Promise<Array<ReferralAgent>>

  abstract findAncestors(agent: ReferralAgent): Promise<Array<ReferralAgent>>
}
