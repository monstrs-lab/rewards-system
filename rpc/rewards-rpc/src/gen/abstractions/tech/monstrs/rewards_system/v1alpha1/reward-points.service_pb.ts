// @generated by protoc-gen-abstractions 0.0.1 with parameter "target=ts"
// @generated from file tech/monstrs/rewards_system/v1alpha1/reward-points.service.proto (package tech.monstrs.rewards_system.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { Query_ID }    from '../../queries/v1alpha1/queries_pb.js'
import type { Query_Order } from '../../queries/v1alpha1/queries_pb.js'
import type { Query_Pager } from '../../queries/v1alpha1/queries_pb.js'

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.RewardPointsBalance
 */
export abstract class RewardPointsBalance {
  /**
   * @generated from field: string id = 1;
   */
  abstract readonly id: string

  /**
   * @generated from field: double amount = 2;
   */
  abstract readonly amount: number
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.ListRewardPointsBalancesRequest
 */
export abstract class ListRewardPointsBalancesRequest {
  /**
   * @generated from field: tech.monstrs.queries.v1alpha1.Query.Pager pager = 1;
   */
  abstract readonly pager?: Query_Pager

  /**
   * @generated from field: tech.monstrs.queries.v1alpha1.Query.Order order = 2;
   */
  abstract readonly order?: Query_Order

  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.ListRewardPointsBalancesRequest.RewardPointsBalancesQuery query = 3;
   */
  abstract readonly query?: ListRewardPointsBalancesRequest_RewardPointsBalancesQuery
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.ListRewardPointsBalancesRequest.RewardPointsBalancesQuery
 */
export abstract class ListRewardPointsBalancesRequest_RewardPointsBalancesQuery {
  /**
   * @generated from field: tech.monstrs.queries.v1alpha1.Query.ID id = 1;
   */
  abstract readonly id?: Query_ID
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.ListRewardPointsBalancesResponse
 */
export abstract class ListRewardPointsBalancesResponse {
  /**
   * @generated from field: repeated tech.monstrs.rewards_system.v1alpha1.RewardPointsBalance reward_points_balances = 1;
   */
  abstract readonly rewardPointsBalances: RewardPointsBalance[]

  /**
   * @generated from field: bool has_next_page = 2;
   */
  abstract readonly hasNextPage: boolean
}
