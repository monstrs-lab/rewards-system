// @generated by protoc-gen-connect-es v0.13.2 with parameter "target=ts"
// @generated from file tech/monstrs/rewardssystem/rewards/v1alpha1/reward-points.service.proto (package tech.monstrs.rewardssystem.rewards.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { MethodKind }                       from '@bufbuild/protobuf'

import { ListRewardPointsBalancesRequest }  from './reward-points.service_pb.js'
import { ListRewardPointsBalancesResponse } from './reward-points.service_pb.js'

/**
 * @generated from service tech.monstrs.rewardssystem.rewards.v1alpha1.RewardPointsService
 */
export const RewardPointsService = {
  typeName: 'tech.monstrs.rewardssystem.rewards.v1alpha1.RewardPointsService',
  methods: {
    /**
     * @generated from rpc tech.monstrs.rewardssystem.rewards.v1alpha1.RewardPointsService.ListRewardPointsBalances
     */
    listRewardPointsBalances: {
      name: 'ListRewardPointsBalances',
      I: ListRewardPointsBalancesRequest,
      O: ListRewardPointsBalancesResponse,
      kind: MethodKind.Unary,
    },
  },
} as const