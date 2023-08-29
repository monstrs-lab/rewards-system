/* eslint-disable @typescript-eslint/consistent-type-imports */

import type { ReferralOperation }                         from '@referral-programs/domain-module'
import type { FindReferralOperationsByQueryResult }       from '@referral-programs/domain-module'
import type { ServiceImpl }                               from '@referral-programs/referral-programs-rpc'
import type { ListReferralOperationsRequest }             from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralOperationsResponse }            from '@referral-programs/referral-programs-rpc/interfaces'
import type { CreateReferralOperationRequest }            from '@referral-programs/referral-programs-rpc/interfaces'
import type { CreateReferralOperationResponse }           from '@referral-programs/referral-programs-rpc/interfaces'
import type { ConfirmReferralOperationRequest }           from '@referral-programs/referral-programs-rpc/interfaces'
import type { ConfirmReferralOperationResponse }          from '@referral-programs/referral-programs-rpc/interfaces'
import type { CreateAndConfirmReferralOperationRequest }  from '@referral-programs/referral-programs-rpc/interfaces'
import type { CreateAndConfirmReferralOperationResponse } from '@referral-programs/referral-programs-rpc/interfaces'

import { UseFilters }                                     from '@nestjs/common'
import { Controller }                                     from '@nestjs/common'
import { QueryBus }                                       from '@nestjs/cqrs'
import { CommandBus }                                     from '@nestjs/cqrs'
import { Validator }                                      from '@monstrs/nestjs-validation'
import { BufExceptionsFilter }                            from '@monstrs/nestjs-buf-errors'
import { BufMethod }                                      from '@wolfcoded/nestjs-bufconnect'
import { BufService }                                     from '@wolfcoded/nestjs-bufconnect'
import { v4 as uuid }                                     from 'uuid'

import { ReferralOperationsService }                      from '@referral-programs/referral-programs-rpc/connect'
import { GetReferralOperationsQuery }                     from '@referral-programs/application-module'
import { GetReferralOperationByIdQuery }                  from '@referral-programs/application-module'
import { CreateReferralOperationCommand }                 from '@referral-programs/application-module'
import { ConfirmReferralOperationCommand }                from '@referral-programs/application-module'
import { CreateAndConfirmReferralOperationCommand }       from '@referral-programs/application-module'

import { ListReferralOperationsPayload }                  from '../payloads/index.js'
import { CreateReferralOperationPayload }                 from '../payloads/index.js'
import { ConfirmReferralOperationPayload }                from '../payloads/index.js'
import { CreateAndConfirmReferralOperationPayload }       from '../payloads/index.js'
import { ListReferralOperationsSerializer }               from '../serializers/index.js'
import { CreateReferralOperationSerializer }              from '../serializers/index.js'
import { ConfirmReferralOperationSerializer }             from '../serializers/index.js'
import { CreateAndConfirmReferralOperationSerializer }    from '../serializers/index.js'

@Controller()
@BufService(ReferralOperationsService)
@UseFilters(BufExceptionsFilter)
export class ReferralOperationsController implements ServiceImpl<typeof ReferralOperationsService> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @BufMethod()
  async createReferralOperation(
    request: CreateReferralOperationRequest
  ): Promise<CreateReferralOperationResponse> {
    const payload = new CreateReferralOperationPayload(request)

    await this.validator.validate(payload)

    const command = new CreateReferralOperationCommand(
      uuid(),
      payload.referralProgram,
      payload.referrerId,
      payload.sourceId,
      payload.sourceType,
      payload.amount
    )

    await this.commandBus.execute(command)

    return new CreateReferralOperationSerializer(
      await this.queryBus.execute<GetReferralOperationByIdQuery, ReferralOperation>(
        new GetReferralOperationByIdQuery(command.referralOperationId)
      )
    )
  }

  @BufMethod()
  async createAndConfirmReferralOperation(
    request: CreateAndConfirmReferralOperationRequest
  ): Promise<CreateAndConfirmReferralOperationResponse> {
    const payload = new CreateAndConfirmReferralOperationPayload(request)

    await this.validator.validate(payload)

    const command = new CreateAndConfirmReferralOperationCommand(
      uuid(),
      payload.referralProgram,
      payload.referrerId,
      payload.sourceId,
      payload.sourceType,
      payload.amount
    )

    await this.commandBus.execute(command)

    return new CreateAndConfirmReferralOperationSerializer(
      await this.queryBus.execute<GetReferralOperationByIdQuery, ReferralOperation>(
        new GetReferralOperationByIdQuery(command.referralOperationId)
      )
    )
  }

  @BufMethod()
  async confirmReferralOperation(
    request: ConfirmReferralOperationRequest
  ): Promise<ConfirmReferralOperationResponse> {
    const payload = new ConfirmReferralOperationPayload(request)

    await this.validator.validate(payload)

    const command = new ConfirmReferralOperationCommand(payload.referralOperationId)

    await this.commandBus.execute(command)

    return new ConfirmReferralOperationSerializer(
      await this.queryBus.execute<GetReferralOperationByIdQuery, ReferralOperation>(
        new GetReferralOperationByIdQuery(command.referralOperationId)
      )
    )
  }

  @BufMethod()
  async listReferralOperations(
    request: ListReferralOperationsRequest
  ): Promise<ListReferralOperationsResponse> {
    const payload = new ListReferralOperationsPayload(request)

    await this.validator.validate(payload)

    return new ListReferralOperationsSerializer(
      await this.queryBus.execute<GetReferralOperationsQuery, FindReferralOperationsByQueryResult>(
        new GetReferralOperationsQuery(payload.pager, payload.order, payload.query)
      )
    )
  }
}
