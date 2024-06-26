// @generated by protoc-gen-interfaces 0.0.1 with parameter "target=ts"
// @generated from file tech/monstrs/rewards_system/v1alpha1/reward-agents.service.proto (package tech.monstrs.rewards_system.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { Struct }      from '@bufbuild/protobuf'

import type { Query_ID }    from '../../queries/v1alpha1/queries_pb.js'
import type { Query_Order } from '../../queries/v1alpha1/queries_pb.js'
import type { Query_Pager } from '../../queries/v1alpha1/queries_pb.js'

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.RewardAgent
 */
export interface RewardAgent {
  /**
   * @generated from field: string id = 1;
   */
  id: string

  /**
   * @generated from field: string code = 2;
   */
  code: string

  /**
   * @generated from field: optional string parent_id = 3;
   */
  parentId?: string

  /**
   * @generated from field: google.protobuf.Struct metadata = 4;
   */
  metadata?: Struct
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.CreateRewardAgentRequest
 */
export interface CreateRewardAgentRequest {
  /**
   * @generated from field: string id = 1;
   */
  id: string

  /**
   * @generated from field: string referral_code = 2;
   */
  referralCode: string
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.CreateRewardAgentResponse
 */
export interface CreateRewardAgentResponse {
  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.RewardAgent result = 1;
   */
  result?: RewardAgent
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.AddRewardAgentMetadataRequest
 */
export interface AddRewardAgentMetadataRequest {
  /**
   * @generated from field: string reward_agent_id = 1;
   */
  rewardAgentId: string

  /**
   * @generated from field: google.protobuf.Struct metadata = 2;
   */
  metadata?: Struct
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.AddRewardAgentMetadataResponse
 */
export interface AddRewardAgentMetadataResponse {
  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.RewardAgent result = 1;
   */
  result?: RewardAgent
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.ListRewardAgentsRequest
 */
export interface ListRewardAgentsRequest {
  /**
   * @generated from field: tech.monstrs.queries.v1alpha1.Query.Pager pager = 1;
   */
  pager?: Query_Pager

  /**
   * @generated from field: tech.monstrs.queries.v1alpha1.Query.Order order = 2;
   */
  order?: Query_Order

  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.ListRewardAgentsRequest.RewardAgentsQuery query = 3;
   */
  query?: ListRewardAgentsRequest_RewardAgentsQuery
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.ListRewardAgentsRequest.RewardAgentsQuery
 */
export interface ListRewardAgentsRequest_RewardAgentsQuery {
  /**
   * @generated from field: tech.monstrs.queries.v1alpha1.Query.ID id = 1;
   */
  id?: Query_ID
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.ListRewardAgentsResponse
 */
export interface ListRewardAgentsResponse {
  /**
   * @generated from field: repeated tech.monstrs.rewards_system.v1alpha1.RewardAgent reward_agents = 1;
   */
  rewardAgents: RewardAgent[]

  /**
   * @generated from field: bool has_next_page = 2;
   */
  hasNextPage: boolean
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.GetRewardAgentNetworkRequest
 */
export interface GetRewardAgentNetworkRequest {
  /**
   * @generated from field: string reward_agent_id = 1;
   */
  rewardAgentId: string
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.GetRewardAgentNetworkResponse
 */
export interface GetRewardAgentNetworkResponse {
  /**
   * @generated from field: repeated tech.monstrs.rewards_system.v1alpha1.RewardAgent reward_agents = 1;
   */
  rewardAgents: RewardAgent[]
}
