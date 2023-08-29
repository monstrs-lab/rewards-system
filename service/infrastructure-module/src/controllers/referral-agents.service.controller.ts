/* eslint-disable @typescript-eslint/consistent-type-imports */

import type { ReferralAgent }                    from '@referral-programs/domain-module'
import type { FindReferralAgentsByQueryResult }  from '@referral-programs/domain-module'
import type { ServiceImpl }                      from '@referral-programs/referral-programs-rpc'
import type { AddReferralAgentMetadataRequest }  from '@referral-programs/referral-programs-rpc/interfaces'
import type { AddReferralAgentMetadataResponse } from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralAgentsRequest }        from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralAgentsResponse }       from '@referral-programs/referral-programs-rpc/interfaces'
import type { GetReferralAgentNetworkRequest }   from '@referral-programs/referral-programs-rpc/interfaces'
import type { GetReferralAgentNetworkResponse }  from '@referral-programs/referral-programs-rpc/interfaces'
import type { CreateReferralAgentRequest }       from '@referral-programs/referral-programs-rpc/interfaces'
import type { CreateReferralAgentResponse }      from '@referral-programs/referral-programs-rpc/interfaces'

import { UseFilters }                            from '@nestjs/common'
import { Controller }                            from '@nestjs/common'
import { QueryBus }                              from '@nestjs/cqrs'
import { CommandBus }                            from '@nestjs/cqrs'
import { Validator }                             from '@monstrs/nestjs-validation'
import { BufExceptionsFilter }                   from '@monstrs/nestjs-buf-errors'
import { BufMethod }                             from '@wolfcoded/nestjs-bufconnect'
import { BufService }                            from '@wolfcoded/nestjs-bufconnect'

import { ReferralAgentsService }                 from '@referral-programs/referral-programs-rpc/connect'
import { GetReferralAgentsQuery }                from '@referral-programs/application-module'
import { GetReferralAgentByIdQuery }             from '@referral-programs/application-module'
import { GetReferralAgentNetworkByIdQuery }      from '@referral-programs/application-module'
import { CreateReferralAgentCommand }            from '@referral-programs/application-module'
import { AddReferralAgentMetadataCommand }       from '@referral-programs/application-module'

import { ListReferralAgentsPayload }             from '../payloads/index.js'
import { GetReferralAgentNetworkPayload }        from '../payloads/index.js'
import { CreateReferralAgentPayload }            from '../payloads/index.js'
import { AddReferralAgentMetadataPayload }       from '../payloads/index.js'
import { ListReferralAgentsSerializer }          from '../serializers/index.js'
import { CreateReferralAgentSerializer }         from '../serializers/index.js'
import { AddReferralAgentMetadataSerializer }    from '../serializers/index.js'
import { GetReferralAgentNetworkSerializer }     from '../serializers/index.js'

@Controller()
@BufService(ReferralAgentsService)
@UseFilters(BufExceptionsFilter)
export class ReferralAgentsController implements ServiceImpl<typeof ReferralAgentsService> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @BufMethod()
  async createReferralAgent(
    request: CreateReferralAgentRequest
  ): Promise<CreateReferralAgentResponse> {
    const payload = new CreateReferralAgentPayload(request)

    await this.validator.validate(payload)

    const command = new CreateReferralAgentCommand(payload.id, payload.referralCode)

    await this.commandBus.execute(command)

    return new CreateReferralAgentSerializer(
      await this.queryBus.execute<GetReferralAgentByIdQuery, ReferralAgent>(
        new GetReferralAgentByIdQuery(command.id)
      )
    )
  }

  @BufMethod()
  async addReferralAgentMetadata(
    request: AddReferralAgentMetadataRequest
  ): Promise<AddReferralAgentMetadataResponse> {
    const payload = new AddReferralAgentMetadataPayload(request)

    await this.validator.validate(payload)

    const command = new AddReferralAgentMetadataCommand(payload.referralAgentId, payload.metadata)

    await this.commandBus.execute(command)

    return new AddReferralAgentMetadataSerializer(
      await this.queryBus.execute<GetReferralAgentByIdQuery, ReferralAgent>(
        new GetReferralAgentByIdQuery(command.referralAgentId)
      )
    )
  }

  @BufMethod()
  async listReferralAgents(
    request: ListReferralAgentsRequest
  ): Promise<ListReferralAgentsResponse> {
    const payload = new ListReferralAgentsPayload(request)

    await this.validator.validate(payload)

    return new ListReferralAgentsSerializer(
      await this.queryBus.execute<GetReferralAgentsQuery, FindReferralAgentsByQueryResult>(
        new GetReferralAgentsQuery(payload.pager, payload.order, payload.query)
      )
    )
  }

  @BufMethod()
  async getReferralAgentNetwork(
    request: GetReferralAgentNetworkRequest
  ): Promise<GetReferralAgentNetworkResponse> {
    const payload = new GetReferralAgentNetworkPayload(request)

    await this.validator.validate(payload)

    return new GetReferralAgentNetworkSerializer(
      await this.queryBus.execute<GetReferralAgentNetworkByIdQuery, Array<ReferralAgent>>(
        new GetReferralAgentNetworkByIdQuery(payload.referralAgentId)
      )
    )
  }
}
