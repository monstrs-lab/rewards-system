import type { PromiseClient }    from '@bufbuild/connect'

import { createPromiseClient }   from '@bufbuild/connect'
import { createGrpcTransport }   from '@bufbuild/connect-node'

import { RewardProgramsService } from './gen/connect/index.js'

export const createRewardProgramsClient = (
  options = {}
): PromiseClient<typeof RewardProgramsService> =>
  createPromiseClient(
    RewardProgramsService,
    createGrpcTransport({
      httpVersion: '2',
      baseUrl: process.env.REFERRAL_PROGRAMS_SERVICE_URL || 'http://0.0.0.0:50051',
      ...options,
    })
  )

export const referralProgramsClient = createRewardProgramsClient()
