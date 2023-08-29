import type { PromiseClient }        from '@bufbuild/connect'

import { createPromiseClient }       from '@bufbuild/connect'
import { createGrpcTransport }       from '@bufbuild/connect-node'

import { ReferralOperationsService } from './gen/connect/index.js'

export const createReferralOperationsClient = (
  options = {}
): PromiseClient<typeof ReferralOperationsService> =>
  createPromiseClient(
    ReferralOperationsService,
    createGrpcTransport({
      httpVersion: '2',
      baseUrl: process.env.REFERRAL_PROGRAMS_SERVICE_URL || 'http://0.0.0.0:50051',
      ...options,
    })
  )

export const referralOperationsClient = createReferralOperationsClient()
