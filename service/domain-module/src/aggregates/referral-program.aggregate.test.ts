import { describe }                  from '@jest/globals'
import { expect }                    from '@jest/globals'
import { it }                        from '@jest/globals'

import { ReferralProgram }           from './referral-program.aggregate.js'
import { ReferralProgramConditions } from '../value-objects/index.js'
import { ReferralProgramField }      from '../value-objects/index.js'
import { ReferralProgramRule }       from '../entities/index.js'

describe('referral-programs', () => {
  describe('domain', () => {
    describe('aggregates', () => {
      describe('referral-program', () => {
        it('check create', async () => {
          const referralProgram = new ReferralProgram().create(
            '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
            'test',
            'test',
            100
          )

          expect(referralProgram.getUncommittedEvents()).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                referralProgramId: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                name: 'test',
                code: 'test',
                percentage: 100,
              }),
            ])
          )

          expect(referralProgram).toEqual(
            expect.objectContaining({
              id: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
              name: 'test',
              code: 'test',
              percentage: 100,
            })
          )
        })

        it('check update', async () => {
          const referralProgram = new ReferralProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .update('updated', 50)

          expect(referralProgram.getUncommittedEvents()).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                referralProgramId: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                name: 'updated',
                percentage: 50,
              }),
            ])
          )

          expect(referralProgram).toEqual(
            expect.objectContaining({
              id: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
              name: 'updated',
              code: 'test',
              percentage: 50,
            })
          )
        })

        it('check add rule', async () => {
          const referralProgram = new ReferralProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              ReferralProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                ReferralProgramConditions.create({ any: [] }),
                [ReferralProgramField.create(50, ReferralProgramConditions.create({ any: [] }))]
              )
            )

          expect(referralProgram).toEqual(
            expect.objectContaining({
              rules: expect.arrayContaining([
                expect.objectContaining({
                  id: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                  name: 'test',
                  order: 0,
                  conditions: expect.objectContaining({
                    conditions: { any: [] },
                  }),
                  fields: expect.arrayContaining([
                    expect.objectContaining({
                      percentage: 50,
                      conditions: expect.objectContaining({
                        conditions: { any: [] },
                      }),
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it('check update rule', async () => {
          const referralProgram = new ReferralProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              ReferralProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                ReferralProgramConditions.create({ any: [] }),
                [ReferralProgramField.create(50, ReferralProgramConditions.create({ any: [] }))]
              )
            )
            .updateRule(
              ReferralProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'updated',
                1,
                ReferralProgramConditions.create({ all: [] }),
                [ReferralProgramField.create(10, ReferralProgramConditions.create({ all: [] }))]
              )
            )

          expect(referralProgram).toEqual(
            expect.objectContaining({
              rules: expect.arrayContaining([
                expect.objectContaining({
                  id: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                  name: 'updated',
                  order: 1,
                  conditions: expect.objectContaining({
                    conditions: { all: [] },
                  }),
                  fields: expect.arrayContaining([
                    expect.objectContaining({
                      percentage: 10,
                      conditions: expect.objectContaining({
                        conditions: { all: [] },
                      }),
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it('check delete rule', async () => {
          const referralProgram = new ReferralProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              ReferralProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                ReferralProgramConditions.create({ any: [] }),
                [ReferralProgramField.create(50, ReferralProgramConditions.create({ any: [] }))]
              )
            )
            .deleteRule('9cb7d053-8921-49a3-aaa3-7d9b122fa235')

          expect(referralProgram.rules.length).toBe(0)
        })
      })
    })
  })
})
