/* eslint-disable @typescript-eslint/consistent-type-imports */

import type { ReferralProgram }                   from '@referral-programs/domain-module'
import type { FindReferralProgramsByQueryResult } from '@referral-programs/domain-module'
import type { ServiceImpl }                       from '@referral-programs/referral-programs-rpc'
import type { AddReferralProgramRuleRequest }     from '@referral-programs/referral-programs-rpc/interfaces'
import type { AddReferralProgramRuleResponse }    from '@referral-programs/referral-programs-rpc/interfaces'
import type { UpdateReferralProgramRuleRequest }  from '@referral-programs/referral-programs-rpc/interfaces'
import type { UpdateReferralProgramRuleResponse } from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralProgramsRequest }       from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralProgramsResponse }      from '@referral-programs/referral-programs-rpc/interfaces'
import type { CreateReferralProgramRequest }      from '@referral-programs/referral-programs-rpc/interfaces'
import type { CreateReferralProgramResponse }     from '@referral-programs/referral-programs-rpc/interfaces'
import type { UpdateReferralProgramRequest }      from '@referral-programs/referral-programs-rpc/interfaces'
import type { UpdateReferralProgramResponse }     from '@referral-programs/referral-programs-rpc/interfaces'

import { UseFilters }                             from '@nestjs/common'
import { Controller }                             from '@nestjs/common'
import { QueryBus }                               from '@nestjs/cqrs'
import { CommandBus }                             from '@nestjs/cqrs'
import { Validator }                              from '@monstrs/nestjs-validation'
import { BufExceptionsFilter }                    from '@monstrs/nestjs-buf-errors'
import { BufMethod }                              from '@wolfcoded/nestjs-bufconnect'
import { BufService }                             from '@wolfcoded/nestjs-bufconnect'
import { v4 as uuid }                             from 'uuid'

import { ReferralProgramsService }                from '@referral-programs/referral-programs-rpc/connect'
import { GetReferralProgramsQuery }               from '@referral-programs/application-module'
import { GetReferralProgramByIdQuery }            from '@referral-programs/application-module'
import { CreateReferralProgramCommand }           from '@referral-programs/application-module'
import { UpdateReferralProgramCommand }           from '@referral-programs/application-module'
import { AddReferralProgramRuleCommand }          from '@referral-programs/application-module'
import { UpdateReferralProgramRuleCommand }       from '@referral-programs/application-module'

import { ListReferralProgramsPayload }            from '../payloads/index.js'
import { CreateReferralProgramPayload }           from '../payloads/index.js'
import { UpdateReferralProgramPayload }           from '../payloads/index.js'
import { AddReferralProgramRulePayload }          from '../payloads/index.js'
import { UpdateReferralProgramRulePayload }       from '../payloads/index.js'
import { ListReferralProgramsSerializer }         from '../serializers/index.js'
import { CreateReferralProgramSerializer }        from '../serializers/index.js'
import { UpdateReferralProgramSerializer }        from '../serializers/index.js'
import { AddReferralProgramRuleSerializer }       from '../serializers/index.js'
import { UpdateReferralProgramRuleSerializer }    from '../serializers/index.js'

@Controller()
@BufService(ReferralProgramsService)
@UseFilters(BufExceptionsFilter)
export class ReferralProgramsController implements ServiceImpl<typeof ReferralProgramsService> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @BufMethod()
  async listReferralPrograms(
    request: ListReferralProgramsRequest
  ): Promise<ListReferralProgramsResponse> {
    const payload = new ListReferralProgramsPayload(request)

    await this.validator.validate(payload)

    return new ListReferralProgramsSerializer(
      await this.queryBus.execute<GetReferralProgramsQuery, FindReferralProgramsByQueryResult>(
        new GetReferralProgramsQuery(payload.pager, payload.order, payload.query)
      )
    )
  }

  @BufMethod()
  async createReferralProgram(
    request: CreateReferralProgramRequest
  ): Promise<CreateReferralProgramResponse> {
    const payload = new CreateReferralProgramPayload(request)

    await this.validator.validate(payload)

    const command = new CreateReferralProgramCommand(
      uuid(),
      payload.name,
      payload.code,
      payload.percentage
    )

    await this.commandBus.execute(command)

    return new CreateReferralProgramSerializer(
      await this.queryBus.execute<GetReferralProgramByIdQuery, ReferralProgram>(
        new GetReferralProgramByIdQuery(command.id)
      )
    )
  }

  @BufMethod()
  async updateReferralProgram(
    request: UpdateReferralProgramRequest
  ): Promise<UpdateReferralProgramResponse> {
    const payload = new UpdateReferralProgramPayload(request)

    await this.validator.validate(payload)

    const command = new UpdateReferralProgramCommand(
      payload.referralProgramId,
      payload.name,
      payload.percentage
    )

    await this.commandBus.execute(command)

    return new UpdateReferralProgramSerializer(
      await this.queryBus.execute<GetReferralProgramByIdQuery, ReferralProgram>(
        new GetReferralProgramByIdQuery(command.referralProgramId)
      )
    )
  }

  @BufMethod()
  async addReferralProgramRule(
    request: AddReferralProgramRuleRequest
  ): Promise<AddReferralProgramRuleResponse> {
    const payload = new AddReferralProgramRulePayload(request)

    await this.validator.validate(payload)

    const command = new AddReferralProgramRuleCommand(
      uuid(),
      payload.referralProgramId,
      payload.order,
      payload.name,
      payload.conditions,
      payload.fields
    )

    await this.commandBus.execute(command)

    return new AddReferralProgramRuleSerializer(
      await this.queryBus.execute<GetReferralProgramByIdQuery, ReferralProgram>(
        new GetReferralProgramByIdQuery(command.referralProgramId)
      )
    )
  }

  @BufMethod()
  async updateReferralProgramRule(
    request: UpdateReferralProgramRuleRequest
  ): Promise<UpdateReferralProgramRuleResponse> {
    const payload = new UpdateReferralProgramRulePayload(request)

    await this.validator.validate(payload)

    const command = new UpdateReferralProgramRuleCommand(
      payload.referralProgramRuleId,
      payload.referralProgramId,
      payload.order,
      payload.name,
      payload.conditions,
      payload.fields
    )

    await this.commandBus.execute(command)

    return new UpdateReferralProgramRuleSerializer(
      await this.queryBus.execute<GetReferralProgramByIdQuery, ReferralProgram>(
        new GetReferralProgramByIdQuery(command.referralProgramId)
      )
    )
  }
}
