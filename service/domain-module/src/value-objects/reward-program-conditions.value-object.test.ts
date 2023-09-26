import type { TopLevelCondition }  from 'json-rules-engine'

import { GuardErrors }             from '@monstrs/guard-clause'
import { GuardError }              from '@monstrs/guard-clause'
import { describe }                from '@jest/globals'
import { expect }                  from '@jest/globals'
import { it }                      from '@jest/globals'

import { RewardProgramConditions } from './reward-program-conditions.value-object.js'

describe('rewards-system', () => {
  describe('domain', () => {
    describe('value-object', () => {
      describe('reward-program-conditions', () => {
        it('check validate conditions', async () => {
          expect.assertions(3)

          try {
            RewardProgramConditions.create({
              some: [],
            } as any as TopLevelCondition)
          } catch (error) {
            if (error instanceof GuardErrors) {
              expect(error.errors.at(0)).toBeInstanceOf(GuardError)
              expect(error.errors.at(0)!.code).toBe('guard.against.not-json-schema-valid')
              expect(error.errors.at(0)!.parameter).toBe('conditions')
            }
          }
        })

        it('check create conditions', async () => {
          expect(
            RewardProgramConditions.create({
              all: [
                {
                  fact: 'test',
                  operator: 'equal',
                  value: true,
                },
              ],
            })
          ).toEqual(
            expect.objectContaining({
              conditions: expect.objectContaining({
                all: expect.arrayContaining([
                  expect.objectContaining({
                    fact: 'test',
                    operator: 'equal',
                    value: true,
                  }),
                ]),
              }),
            })
          )
        })

        it('check match conditions', async () => {
          expect(
            RewardProgramConditions.create({
              all: [
                {
                  fact: 'test',
                  operator: 'equal',
                  value: true,
                },
              ],
            }).match({ test: true })
          ).resolves.toBe(true)
        })

        it('check not match conditions', async () => {
          expect(
            RewardProgramConditions.create({
              all: [
                {
                  fact: 'test',
                  operator: 'equal',
                  value: true,
                },
              ],
            }).match({ test: false })
          ).resolves.toBe(false)
        })

        it('check match undefined facts conditions', async () => {
          expect(
            RewardProgramConditions.create({
              all: [
                {
                  fact: 'test',
                  operator: 'equal',
                  value: true,
                },
              ],
            }).match({})
          ).resolves.toBe(false)
        })
      })
    })
  })
})
