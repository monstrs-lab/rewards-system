import type { PromiseClient }    from '@bufbuild/connect'

import { createPromiseClient }   from '@bufbuild/connect'
import { createGrpcTransport }   from '@bufbuild/connect-node'

import { ReferralPointsService } from './gen/connect/index.js'

export const createReferralPointsClient = (
  options = {}
): PromiseClient<typeof ReferralPointsService> =>
  createPromiseClient(
    ReferralPointsService,
    createGrpcTransport({
      httpVersion: '2',
      baseUrl: process.env.REFERRAL_PROGRAMS_SERVICE_URL || 'http://0.0.0.0:50051',
      ...options,
    })
  )

export const referralPointsClient = createReferralPointsClient()
