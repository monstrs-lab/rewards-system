import { describe }                from '@jest/globals'
import { expect }                  from '@jest/globals'
import { it }                      from '@jest/globals'

import { RewardProgram }           from './reward-program.aggregate.js'
import { RewardOperation }         from './reward-operation.aggregate.js'
import { RewardAgent }             from './reward-agent.aggregate.js'
import { RewardProgramConditions } from '../value-objects/index.js'
import { RewardProgramField }      from '../value-objects/index.js'
import { RewardOperationSource }   from '../entities/index.js'
import { RewardProgramRule }       from '../entities/index.js'

describe('rewards-system', () => {
  describe('domain', () => {
    describe('aggregates', () => {
      describe('Reward-program', () => {
        it('check create', async () => {
          const rewardProgram = new RewardProgram().create(
            '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
            'test',
            'test',
            100
          )

          expect(rewardProgram.getUncommittedEvents()).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                rewardProgramId: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                name: 'test',
                code: 'test',
                percentage: 100,
              }),
            ])
          )

          expect(rewardProgram).toEqual(
            expect.objectContaining({
              id: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
              name: 'test',
              code: 'test',
              percentage: 100,
            })
          )
        })

        it('check update', async () => {
          const rewardProgram = new RewardProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .update('updated', 50)

          expect(rewardProgram.getUncommittedEvents()).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                rewardProgramId: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                name: 'updated',
                percentage: 50,
              }),
            ])
          )

          expect(rewardProgram).toEqual(
            expect.objectContaining({
              id: '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
              name: 'updated',
              code: 'test',
              percentage: 50,
            })
          )
        })

        it('check add rule', async () => {
          const rewardProgram = new RewardProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              RewardProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                RewardProgramConditions.create({ any: [] }),
                [RewardProgramField.create(50, RewardProgramConditions.create({ any: [] }))]
              )
            )

          expect(rewardProgram).toEqual(
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
          const rewardProgram = new RewardProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              RewardProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                RewardProgramConditions.create({ any: [] }),
                [RewardProgramField.create(50, RewardProgramConditions.create({ any: [] }))]
              )
            )
            .updateRule(
              RewardProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'updated',
                1,
                RewardProgramConditions.create({ all: [] }),
                [RewardProgramField.create(10, RewardProgramConditions.create({ all: [] }))]
              )
            )

          expect(rewardProgram).toEqual(
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
          const rewardProgram = new RewardProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              RewardProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                RewardProgramConditions.create({ any: [] }),
                [RewardProgramField.create(50, RewardProgramConditions.create({ any: [] }))]
              )
            )
            .deleteRule('9cb7d053-8921-49a3-aaa3-7d9b122fa235')

          expect(rewardProgram.rules.length).toBe(0)
        })
      })

      describe('Reward program simple calculation', () => {
        it('check calculate for all recipients', async () => {
          const [profit1, profit2, profit3] = await new RewardProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              RewardProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                RewardProgramConditions.create({ any: [] }),
                [
                  RewardProgramField.create(
                    15,
                    RewardProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                  RewardProgramField.create(
                    10,
                    RewardProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                  RewardProgramField.create(
                    5,
                    RewardProgramConditions.create({
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
              new RewardOperation().create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                RewardOperationSource.create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test'),
                100
              ),
              new RewardAgent().create('9cb7d053-8921-49a3-aaa3-7d9b122fa235'),
              [
                new RewardAgent().create('35bf6cda-0399-4176-935d-5d62857c2a84').addMetadata({
                  allow: true,
                }),
                new RewardAgent().create('3d9bdf33-12cd-4aff-9257-bbb412c65668').addMetadata({
                  allow: true,
                }),
                new RewardAgent().create('d9bcda1a-97ad-47b6-8fc6-da79ddcbc4aa').addMetadata({
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
          const [profit1, profit2] = await new RewardProgram()
            .create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test', 'test', 100)
            .addRule(
              RewardProgramRule.create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                'test',
                0,
                RewardProgramConditions.create({ any: [] }),
                [
                  RewardProgramField.create(
                    15,
                    RewardProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                  RewardProgramField.create(
                    10,
                    RewardProgramConditions.create({
                      any: [
                        {
                          fact: 'allow',
                          operator: 'equal',
                          value: true,
                        },
                      ],
                    })
                  ),
                  RewardProgramField.create(
                    5,
                    RewardProgramConditions.create({
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
              new RewardOperation().create(
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                '9cb7d053-8921-49a3-aaa3-7d9b122fa235',
                RewardOperationSource.create('9cb7d053-8921-49a3-aaa3-7d9b122fa235', 'test'),
                100
              ),
              new RewardAgent().create('9cb7d053-8921-49a3-aaa3-7d9b122fa235'),
              [
                new RewardAgent().create('35bf6cda-0399-4176-935d-5d62857c2a84').addMetadata({
                  allow: true,
                }),
                new RewardAgent().create('3d9bdf33-12cd-4aff-9257-bbb412c65668'),
                new RewardAgent().create('d9bcda1a-97ad-47b6-8fc6-da79ddcbc4aa').addMetadata({
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
