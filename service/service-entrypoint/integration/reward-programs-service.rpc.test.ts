import type { PromiseClient }                           from '@connectrpc/connect'
import type { INestMicroservice }                       from '@nestjs/common'
import type { StartedKafkaContainer }                   from '@testcontainers/kafka'
import type { StartedTestContainer }                    from 'testcontainers'

import { Struct }                                       from '@bufbuild/protobuf'
import { ConnectError }                                 from '@connectrpc/connect'
import { ConnectRpcServer }                             from '@monstrs/nestjs-connectrpc'
import { ServerProtocol }                               from '@monstrs/nestjs-connectrpc'
import { Test }                                         from '@nestjs/testing'
import { KafkaContainer }                               from '@testcontainers/kafka'
import { createPromiseClient }                          from '@connectrpc/connect'
import { createGrpcTransport }                          from '@connectrpc/connect-node'
import { faker }                                        from '@faker-js/faker'
import { describe }                                     from '@jest/globals'
import { afterAll }                                     from '@jest/globals'
import { beforeAll }                                    from '@jest/globals'
import { expect }                                       from '@jest/globals'
import { it }                                           from '@jest/globals'
import { findValidationErrorDetails }                   from '@monstrs/protobuf-rpc'
import { GenericContainer }                             from 'testcontainers'
import { Wait }                                         from 'testcontainers'
import { default as pg }                                from 'pg'
import getPort                                          from 'get-port'

import { REWARDS_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS } from '@rewards-system/infrastructure-module'
import { RewardProgramsService }                        from '@rewards-system/rewards-rpc/connect'

import { RewardsSystemServiceEntrypointModule }         from '../src/rewards-system-service-entrypoint.module.js'

describe('rewards-system-service', () => {
  describe('rpc', () => {
    let postgres: StartedTestContainer
    let kafka: StartedKafkaContainer
    let service: INestMicroservice
    let client: PromiseClient<typeof RewardProgramsService>

    beforeAll(async () => {
      kafka = await new KafkaContainer().withExposedPorts(9093).start()

      postgres = await new GenericContainer('bitnami/postgresql')
        .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
        .withEnvironment({
          POSTGRESQL_PASSWORD: 'password',
          POSTGRESQL_DATABASE: 'db',
        })
        .withExposedPorts(5432)
        .start()

      const pgclient = new pg.Client({
        port: postgres.getMappedPort(5432),
        database: 'db',
        user: 'postgres',
        password: 'password',
      })

      await pgclient.connect()
      await pgclient.query('CREATE EXTENSION IF NOT EXISTS ltree;')
      await pgclient.end()

      const port = await getPort()

      const testingModule = await Test.createTestingModule({
        imports: [RewardsSystemServiceEntrypointModule],
      })
        .overrideProvider(REWARDS_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS)
        .useValue({
          db: {
            port: postgres.getMappedPort(5432),
          },
          events: {
            brokers: [`${kafka.getHost()}:${kafka.getMappedPort(9093)}`],
          },
        })
        .compile()

      service = testingModule.createNestMicroservice({
        strategy: new ConnectRpcServer({
          protocol: ServerProtocol.HTTP2_INSECURE,
          port,
        }),
      })

      await service.listen()

      client = createPromiseClient(
        RewardProgramsService,
        createGrpcTransport({
          httpVersion: '2',
          baseUrl: `http://localhost:${port}`,
          idleConnectionTimeoutMs: 1000,
        })
      )
    })

    afterAll(async () => {
      await service.close()
      await postgres.stop()
      await kafka.stop()
    })

    describe('reward programs', () => {
      describe('create reward program', () => {
        it('check invalid name validation', async () => {
          expect.assertions(1)

          try {
            await client.createRewardProgram({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'name',
                    property: 'name',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isNotEmpty',
                        constraint: 'name should not be empty',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid code validation', async () => {
          expect.assertions(1)

          try {
            await client.createRewardProgram({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'code',
                    property: 'code',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isNotEmpty',
                        constraint: 'code should not be empty',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid percentage validation', async () => {
          expect.assertions(1)

          try {
            await client.createRewardProgram({
              percentage: 200,
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'percentage',
                    property: 'percentage',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'max',
                        constraint: 'percentage must not be greater than 100',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check create reward program', async () => {
          const name = faker.word.sample()
          const code = faker.word.sample()
          const percentage = faker.number.int(100)

          const { result } = await client.createRewardProgram({
            name,
            code,
            percentage,
          })

          expect(result?.id).toBeTruthy()
          expect(result?.name).toBe(name)
          expect(result?.code).toBe(code)
          expect(result?.percentage).toBe(percentage)
        })

        it('check code already exists', async () => {
          expect.assertions(1)

          const { result } = await client.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          try {
            await client.createRewardProgram({
              name: result!.name,
              code: result!.code,
              percentage: result!.percentage,
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(
                `Reward program with code '${result!.code}' already exists`
              )
            }
          }
        })
      })

      describe('update reward program', () => {
        it('check invalid id validation', async () => {
          expect.assertions(1)

          try {
            await client.updateRewardProgram({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'rewardProgramId',
                    property: 'rewardProgramId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'rewardProgramId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid name validation', async () => {
          expect.assertions(1)

          try {
            await client.updateRewardProgram({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'name',
                    property: 'name',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isNotEmpty',
                        constraint: 'name should not be empty',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid percentage validation', async () => {
          expect.assertions(1)

          try {
            await client.updateRewardProgram({
              percentage: 200,
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'percentage',
                    property: 'percentage',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'max',
                        constraint: 'percentage must not be greater than 100',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check update not found reward program', async () => {
          expect.assertions(1)

          const rewardProgramId = faker.string.uuid()

          try {
            await client.updateRewardProgram({
              rewardProgramId,
              name: faker.word.sample(),
              percentage: faker.number.int(100),
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(`Reward program with id '${rewardProgramId}' not found`)
            }
          }
        })

        it('check update reward program', async () => {
          const name = faker.word.sample()
          const percentage = faker.number.int(100)

          const { result: rewardProgram } = await client.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result } = await client.updateRewardProgram({
            rewardProgramId: rewardProgram!.id,
            name,
            percentage,
          })

          expect(result?.name).toBe(name)
          expect(result?.percentage).toBe(percentage)
        })
      })

      describe('add reward program rule', () => {
        it('check invalid reward program id validation', async () => {
          expect.assertions(1)

          try {
            await client.addRewardProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'rewardProgramId',
                    property: 'rewardProgramId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'rewardProgramId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid name validation', async () => {
          expect.assertions(1)

          try {
            await client.addRewardProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'name',
                    property: 'name',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isNotEmpty',
                        constraint: 'name should not be empty',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid conditions validation', async () => {
          expect.assertions(1)

          try {
            await client.addRewardProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'conditions',
                    property: 'conditions',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'IsConditionsValidConstraint',
                        constraint: 'Invalid conditions schema',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid field percentage validation', async () => {
          expect.assertions(1)

          try {
            await client.addRewardProgramRule({
              fields: [
                {
                  percentage: 200,
                },
              ],
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'fields.0.percentage',
                    property: 'percentage',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'max',
                        constraint: 'percentage must not be greater than 100',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid field conditions validation', async () => {
          expect.assertions(1)

          try {
            await client.addRewardProgramRule({
              fields: [
                {
                  conditions: {
                    some: [],
                  } as any,
                },
              ],
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'fields.0.conditions',
                    property: 'conditions',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'IsConditionsValidConstraint',
                        constraint: 'Invalid conditions schema',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check unknown reward program', async () => {
          expect.assertions(1)

          const rewardProgramId = faker.string.uuid()

          try {
            await client.addRewardProgramRule({
              rewardProgramId,
              name: faker.word.sample(),
              order: faker.number.int(100),
              conditions: Struct.fromJson({ all: [] }),
              fields: [],
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(`Reward program with id '${rewardProgramId}' not found`)
            }
          }
        })

        it('check add reward program rule', async () => {
          const { result: rewardProgram } = await client.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const name = faker.word.sample()
          const order = faker.number.int(100)
          const conditions = Struct.fromJson({
            all: [],
          })
          const fields = [
            {
              percentage: faker.number.int(100),
              conditions: Struct.fromJson({
                all: [],
              }),
            },
          ]

          const { result } = await client.addRewardProgramRule({
            rewardProgramId: rewardProgram!.id,
            name,
            order,
            conditions,
            fields,
          })

          expect(result?.rules.at(0)?.id).toBeTruthy()
          expect(result?.rules.at(0)?.name).toBe(name)
          expect(result?.rules.at(0)?.order).toBe(order)
          expect(result?.rules.at(0)?.conditions?.toJson()).toEqual(conditions.toJson())
          expect(result?.rules.at(0)?.fields.at(0)?.percentage).toBe(fields.at(0)?.percentage)
          expect(result?.rules.at(0)?.fields.at(0)?.conditions?.toJson()).toEqual(
            fields.at(0)?.conditions.toJson()
          )
        })
      })

      describe('update reward program rule', () => {
        it('check invalid reward program rule id validation', async () => {
          expect.assertions(1)

          try {
            await client.updateRewardProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'rewardProgramRuleId',
                    property: 'rewardProgramRuleId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'rewardProgramRuleId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid reward program id validation', async () => {
          expect.assertions(1)

          try {
            await client.updateRewardProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'rewardProgramId',
                    property: 'rewardProgramId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'rewardProgramId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid name validation', async () => {
          expect.assertions(1)

          try {
            await client.updateRewardProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'name',
                    property: 'name',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isNotEmpty',
                        constraint: 'name should not be empty',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid conditions validation', async () => {
          expect.assertions(1)

          try {
            await client.updateRewardProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'conditions',
                    property: 'conditions',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'IsConditionsValidConstraint',
                        constraint: 'Invalid conditions schema',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid field percentage validation', async () => {
          expect.assertions(1)

          try {
            await client.updateRewardProgramRule({
              fields: [
                {
                  percentage: 200,
                },
              ],
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'fields.0.percentage',
                    property: 'percentage',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'max',
                        constraint: 'percentage must not be greater than 100',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid field conditions validation', async () => {
          expect.assertions(1)

          try {
            await client.updateRewardProgramRule({
              fields: [
                {
                  conditions: {
                    some: [],
                  } as any,
                },
              ],
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'fields.0.conditions',
                    property: 'conditions',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'IsConditionsValidConstraint',
                        constraint: 'Invalid conditions schema',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check unknown reward program rule', async () => {
          expect.assertions(1)

          const rewardProgramRuleId = faker.string.uuid()

          const { result: rewardProgram } = await client.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          try {
            await client.updateRewardProgramRule({
              rewardProgramRuleId,
              rewardProgramId: rewardProgram!.id,
              name: faker.word.sample(),
              order: faker.number.int(100),
              conditions: Struct.fromJson({ all: [] }),
              fields: [],
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(
                `Reward program rule with id '${rewardProgramRuleId}' not found`
              )
            }
          }
        })

        it('check update reward program rule', async () => {
          const { result: rewardProgram } = await client.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const name = faker.word.sample()
          const order = faker.number.int(100)
          const conditions = Struct.fromJson({
            all: [],
          })
          const fields = [
            {
              percentage: faker.number.int(100),
              conditions: Struct.fromJson({
                all: [],
              }),
            },
          ]

          const { result: rewardProgramWithRule } = await client.addRewardProgramRule({
            rewardProgramId: rewardProgram!.id,
            name: faker.word.sample(),
            order: faker.number.int(100),
            conditions: Struct.fromJson({
              any: [],
            }),
            fields: [
              {
                percentage: faker.number.int(100),
                conditions: Struct.fromJson({
                  any: [],
                }),
              },
            ],
          })

          const { result } = await client.updateRewardProgramRule({
            rewardProgramRuleId: rewardProgramWithRule?.rules.at(0)?.id,
            rewardProgramId: rewardProgram!.id,
            name,
            order,
            conditions,
            fields,
          })

          expect(result?.rules.at(0)?.id).toBe(rewardProgramWithRule?.rules.at(0)?.id)
          expect(result?.rules.at(0)?.name).toBe(name)
          expect(result?.rules.at(0)?.order).toBe(order)
          expect(result?.rules.at(0)?.conditions?.toJson()).toEqual(conditions.toJson())
          expect(result?.rules.at(0)?.fields.at(0)?.percentage).toBe(fields.at(0)?.percentage)
          expect(result?.rules.at(0)?.fields.at(0)?.conditions?.toJson()).toEqual(
            fields.at(0)?.conditions.toJson()
          )
        })
      })

      describe('delete reward program rule', () => {
        it('check delete reward program rule', async () => {
          const { result: rewardProgram } = await client.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result: rewardProgramWithRule } = await client.addRewardProgramRule({
            rewardProgramId: rewardProgram!.id,
            name: faker.word.sample(),
            order: faker.number.int(100),
            conditions: Struct.fromJson({
              any: [],
            }),
            fields: [
              {
                percentage: faker.number.int(100),
                conditions: Struct.fromJson({
                  any: [],
                }),
              },
            ],
          })

          const { result } = await client.deleteRewardProgramRule({
            rewardProgramId: rewardProgram!.id,
            rewardProgramRuleId: rewardProgramWithRule?.rules.at(0)?.id,
          })

          expect(result?.rules).toEqual([])
        })
      })

      describe('list reward programs', () => {
        it('check get reward programs', async () => {
          const { result: rewardProgram } = await client.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          await client.addRewardProgramRule({
            rewardProgramId: rewardProgram!.id,
            name: faker.word.sample(),
            order: faker.number.int(100),
            conditions: Struct.fromJson({
              any: [],
            }),
            fields: [
              {
                percentage: faker.number.int(100),
                conditions: Struct.fromJson({
                  any: [],
                }),
              },
            ],
          })

          expect(
            client.listRewardPrograms({
              query: {
                id: {
                  conditions: {
                    eq: {
                      value: rewardProgram!.id,
                    },
                  },
                },
              },
            })
          ).resolves.toEqual(
            expect.objectContaining({
              rewardPrograms: expect.arrayContaining([
                expect.objectContaining({
                  id: rewardProgram!.id,
                }),
              ]),
            })
          )
        })
      })
    })
  })
})
