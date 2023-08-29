import type { INestMicroservice }                  from '@nestjs/common'
import type { StartedTestContainer }               from 'testcontainers'
import type { ReferralProgramsService }            from '@referral-programs/referral-programs-rpc/connect'
import type { PromiseClient }                      from '@referral-programs/referral-programs-rpc'

import { Test }                                    from '@nestjs/testing'
import { findValidationErrorDetails }              from '@monstrs/protobuf-rpc'
import { describe }                                from '@jest/globals'
import { afterAll }                                from '@jest/globals'
import { beforeAll }                               from '@jest/globals'
import { expect }                                  from '@jest/globals'
import { it }                                      from '@jest/globals'
import { faker }                                   from '@faker-js/faker'
import { GenericContainer }                        from 'testcontainers'
import { Wait }                                    from 'testcontainers'
import { default as pg }                           from 'pg'
import getPort                                     from 'get-port'

import { ConnectError }                            from '@referral-programs/referral-programs-rpc'
import { Struct }                                  from '@referral-programs/referral-programs-rpc'
import { ServerBufConnect }                        from '@referral-programs/infrastructure-module'
import { ServerProtocol }                          from '@referral-programs/infrastructure-module'
import { MIKRO_ORM_CONFIG_MODULE_OPTIONS_PORT }    from '@referral-programs/infrastructure-module'
import { createReferralProgramsClient }            from '@referral-programs/referral-programs-rpc'

import { ReferralProgramsServiceEntrypointModule } from '../src/referral-programs-service-entrypoint.module.js'

describe('referral-programs-service', () => {
  describe('rpc', () => {
    let postgres: StartedTestContainer
    let service: INestMicroservice
    let client: PromiseClient<typeof ReferralProgramsService>

    beforeAll(async () => {
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
        imports: [ReferralProgramsServiceEntrypointModule],
      })
        .overrideProvider(MIKRO_ORM_CONFIG_MODULE_OPTIONS_PORT)
        .useValue(postgres.getMappedPort(5432))
        .compile()

      service = testingModule.createNestMicroservice({
        strategy: new ServerBufConnect({
          protocol: ServerProtocol.HTTP2_INSECURE,
          port,
        }),
      })

      await service.listen()

      client = createReferralProgramsClient({ baseUrl: `http://localhost:${port}` })
    })

    afterAll(async () => {
      await service.close()
      await postgres.stop()
    })

    describe('referral programs', () => {
      describe('create referral program', () => {
        it('check invalid name validation', async () => {
          expect.assertions(1)

          try {
            await client.createReferralProgram({})
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
            await client.createReferralProgram({})
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
            await client.createReferralProgram({
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

        it('check create referral program', async () => {
          const name = faker.word.sample()
          const code = faker.word.sample()
          const percentage = faker.number.int(100)

          const { result } = await client.createReferralProgram({
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

          const { result } = await client.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          try {
            await client.createReferralProgram({
              name: result!.name,
              code: result!.code,
              percentage: result!.percentage,
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(
                `Referral program with code '${result!.code}' already exists`
              )
            }
          }
        })
      })

      describe('update referral program', () => {
        it('check invalid id validation', async () => {
          expect.assertions(1)

          try {
            await client.updateReferralProgram({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'referralProgramId',
                    property: 'referralProgramId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'referralProgramId must be a UUID',
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
            await client.updateReferralProgram({})
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
            await client.updateReferralProgram({
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

        it('check update not found referral program', async () => {
          expect.assertions(1)

          const referralProgramId = faker.string.uuid()

          try {
            await client.updateReferralProgram({
              referralProgramId,
              name: faker.word.sample(),
              percentage: faker.number.int(100),
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(
                `Referral program with id '${referralProgramId}' not found`
              )
            }
          }
        })

        it('check update referral program', async () => {
          const name = faker.word.sample()
          const percentage = faker.number.int(100)

          const { result: referralProgram } = await client.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result } = await client.updateReferralProgram({
            referralProgramId: referralProgram!.id,
            name,
            percentage,
          })

          expect(result?.name).toBe(name)
          expect(result?.percentage).toBe(percentage)
        })
      })

      describe('add referral program rule', () => {
        it('check invalid referral program id validation', async () => {
          expect.assertions(1)

          try {
            await client.addReferralProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'referralProgramId',
                    property: 'referralProgramId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'referralProgramId must be a UUID',
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
            await client.addReferralProgramRule({})
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
            await client.addReferralProgramRule({})
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
            await client.addReferralProgramRule({
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
            await client.addReferralProgramRule({
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

        it('check unknown referral program', async () => {
          expect.assertions(1)

          const referralProgramId = faker.string.uuid()

          try {
            await client.addReferralProgramRule({
              referralProgramId,
              name: faker.word.sample(),
              order: faker.number.int(100),
              conditions: Struct.fromJson({ all: [] }),
              fields: [],
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(
                `Referral program with id '${referralProgramId}' not found`
              )
            }
          }
        })

        it('check add referral program rule', async () => {
          const { result: referralProgram } = await client.createReferralProgram({
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

          const { result } = await client.addReferralProgramRule({
            referralProgramId: referralProgram!.id,
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

      describe('update referral program rule', () => {
        it('check invalid referral program rule id validation', async () => {
          expect.assertions(1)

          try {
            await client.updateReferralProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'referralProgramRuleId',
                    property: 'referralProgramRuleId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'referralProgramRuleId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid referral program id validation', async () => {
          expect.assertions(1)

          try {
            await client.updateReferralProgramRule({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'referralProgramId',
                    property: 'referralProgramId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'referralProgramId must be a UUID',
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
            await client.updateReferralProgramRule({})
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
            await client.updateReferralProgramRule({})
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
            await client.updateReferralProgramRule({
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
            await client.updateReferralProgramRule({
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

        it('check unknown referral program rule', async () => {
          expect.assertions(1)

          const referralProgramRuleId = faker.string.uuid()

          const { result: referralProgram } = await client.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          try {
            await client.updateReferralProgramRule({
              referralProgramRuleId,
              referralProgramId: referralProgram!.id,
              name: faker.word.sample(),
              order: faker.number.int(100),
              conditions: Struct.fromJson({ all: [] }),
              fields: [],
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(
                `Referral program rule with id '${referralProgramRuleId}' not found`
              )
            }
          }
        })

        it('check update referral program rule', async () => {
          const { result: referralProgram } = await client.createReferralProgram({
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

          const { result: referralProgramWithRule } = await client.addReferralProgramRule({
            referralProgramId: referralProgram!.id,
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

          const { result } = await client.updateReferralProgramRule({
            referralProgramRuleId: referralProgramWithRule?.rules.at(0)?.id,
            referralProgramId: referralProgram!.id,
            name,
            order,
            conditions,
            fields,
          })

          expect(result?.rules.at(0)?.id).toBe(referralProgramWithRule?.rules.at(0)?.id)
          expect(result?.rules.at(0)?.name).toBe(name)
          expect(result?.rules.at(0)?.order).toBe(order)
          expect(result?.rules.at(0)?.conditions?.toJson()).toEqual(conditions.toJson())
          expect(result?.rules.at(0)?.fields.at(0)?.percentage).toBe(fields.at(0)?.percentage)
          expect(result?.rules.at(0)?.fields.at(0)?.conditions?.toJson()).toEqual(
            fields.at(0)?.conditions.toJson()
          )
        })
      })

      describe('delete referral program rule', () => {
        it('check delete referral program rule', async () => {
          const { result: referralProgram } = await client.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result: referralProgramWithRule } = await client.addReferralProgramRule({
            referralProgramId: referralProgram!.id,
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

          const { result } = await client.deleteReferralProgramRule({
            referralProgramId: referralProgram!.id,
            referralProgramRuleId: referralProgramWithRule?.rules.at(0)?.id,
          })

          expect(result?.rules).toEqual([])
        })
      })
    })
  })
})
