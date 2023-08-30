import { describe }                  from '@jest/globals'
import { expect }                    from '@jest/globals'
import { it }                        from '@jest/globals'
import { validate }                  from 'class-validator'

import { Struct }                    from '@rewards-system/rewards-system-rpc'

import { RewardProgramFieldPayload } from './reward-program-field.payload.js'

describe('rewards-system', () => {
  describe('infrastructure', () => {
    describe('payloads', () => {
      describe('reward-program-field', () => {
        it('check invalid conditions', async () => {
          const payload = new RewardProgramFieldPayload({
            percentage: 100,
            conditions: Struct.fromJson({
              some: [],
            }),
          })

          expect(validate(payload)).resolves.toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                property: 'conditions',
                constraints: { IsConditionsValidConstraint: 'Invalid conditions schema' },
              }),
            ])
          )
        })

        it('check valid conditions', async () => {
          const payload = new RewardProgramFieldPayload({
            percentage: 100,
            conditions: Struct.fromJson({
              all: [],
            }),
          })

          expect(validate(payload)).resolves.toEqual([])
        })
      })
    })
  })
})
