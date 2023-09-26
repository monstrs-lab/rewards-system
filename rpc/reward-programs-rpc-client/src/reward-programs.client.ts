import type { PromiseClient }    from '@connectrpc/connect'

import { createPromiseClient }   from '@connectrpc/connect'
import { createGrpcTransport }   from '@connectrpc/connect-node'

import { RewardProgramsService } from '@rewards-system/rewards-rpc/connect'

export const createClient = (options = {}): PromiseClient<typeof RewardProgramsService> =>
  createPromiseClient(
    RewardProgramsService,
    createGrpcTransport({
      httpVersion: '2',
      baseUrl: process.env.REWARDS_SERVICE_URL || 'http://0.0.0.0:50051',
      ...options,
    })
  )

export const rewardPrograms = createClient()
