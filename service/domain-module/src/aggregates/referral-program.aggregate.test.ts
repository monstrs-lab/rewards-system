import { describe }                  from '@jest/globals'
import { expect }                    from '@jest/globals'
import { it }                        from '@jest/globals'

import { ReferralProgram }           from './referral-program.aggregate.js'
import { ReferralOperation }         from './referral-operation.aggregate.js'
import { ReferralAgent }             from './referral-agent.aggregate.js'
import { ReferralProgramConditions } from '../value-objects/index.js'
import { ReferralProgramField }      from '../value-objects/index.js'
import { ReferralOperationSource }   from '../entities/index.js'
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

      describe('referral program simple calculation', () => {
        it('check calculate for all recipients', async () => {
          const [profit1, profit2, profit3] = await new ReferralProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              ReferralProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                ReferralProgramConditions.create({ any: [] }),
                [
                  ReferralProgramField.create(
                    15,
                    ReferralProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                  ReferralProgramField.create(
                    10,
                    ReferralProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                  ReferralProgramField.create(
                    5,
                    ReferralProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                ]
              )
            )
            .calculate(
              new ReferralOperation().create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                ReferralOperationSource.create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test'),
                100
              ),
              new ReferralAgent().create('9cb7d053-8921-49a3-aaa3-7d9b122fa235'),
              [
                new ReferralAgent().create('35bf6cda-0399-4176-935d-5d62857c2a84').addMetadata({
                  allow: true,
                }),
                new ReferralAgent().create('3d9bdf33-12cd-4aff-9257-bbb412c65668').addMetadata({
                  allow: true,
                }),
                new ReferralAgent().create('d9bcda1a-97ad-47b6-8fc6-da79ddcbc4aa').addMetadata({
                  allow: true,
                }),
              ]
            )

          expect(profit1.amount).toBe(100)
          expect(profit1.profit).toBe(15)
          expect(profit1.percentage).toBe(15)
          expect(profit1.level).toBe(1)

          expect(profit2.amount).toBe(100)
          expect(profit2.profit).toBe(10)
          expect(profit2.percentage).toBe(10)
          expect(profit2.level).toBe(2)

          expect(profit3.amount).toBe(100)
          expect(profit3.profit).toBe(5)
          expect(profit3.percentage).toBe(5)
          expect(profit3.level).toBe(3)
        })

        it('check calculate skip recipients', async () => {
          const [profit1, profit2] = await new ReferralProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              ReferralProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                ReferralProgramConditions.create({ any: [] }),
                [
                  ReferralProgramField.create(
                    15,
                    ReferralProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                  ReferralProgramField.create(
                    10,
                    ReferralProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                  ReferralProgramField.create(
                    5,
                    ReferralProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                ]
              )
            )
            .calculate(
              new ReferralOperation().create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                ReferralOperationSource.create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test'),
                100
              ),
              new ReferralAgent().create('9cb7d053-8921-49a3-aaa3-7d9b122fa235'),
              [
                new ReferralAgent().create('35bf6cda-0399-4176-935d-5d62857c2a84').addMetadata({
                  allow: true,
                }),
                new ReferralAgent().create('3d9bdf33-12cd-4aff-9257-bbb412c65668'),
                new ReferralAgent().create('d9bcda1a-97ad-47b6-8fc6-da79ddcbc4aa').addMetadata({
                  allow: true,
                }),
              ]
            )

          expect(profit1.amount).toBe(100)
          expect(profit1.profit).toBe(15)
          expect(profit1.percentage).toBe(15)
          expect(profit1.level).toBe(1)

          expect(profit2.amount).toBe(100)
          expect(profit2.profit).toBe(5)
          expect(profit2.percentage).toBe(5)
          expect(profit2.level).toBe(3)
        })
      })
    })
  })
})
