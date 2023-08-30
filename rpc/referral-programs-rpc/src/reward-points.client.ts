import type { PromiseClient }  from '@bufbuild/connect'

import { createPromiseClient } from '@bufbuild/connect'
import { createGrpcTransport } from '@bufbuild/connect-node'

import { RewardPointsService } from './gen/connect/index.js'

export const createRewardPointsClient = (options = {}): PromiseClient<typeof RewardPointsService> =>
  createPromiseClient(
    RewardPointsService,
    createGrpcTransport({
      httpVersion: '2',
      baseUrl: process.env.REFERRAL_PROGRAMS_SERVICE_URL || 'http://0.0.0.0:50051',
      ...options,
    })
  )

export const referralPointsClient = createRewardPointsClient()
