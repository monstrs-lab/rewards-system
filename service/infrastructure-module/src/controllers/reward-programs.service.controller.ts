import type { ServiceImpl }                     from '@connectrpc/connect'
import type { RewardProgram }                   from '@rewards-system/domain-module'
import type { FindRewardProgramsByQueryResult } from '@rewards-system/domain-module'
import type { AddRewardProgramRuleRequest }     from '@rewards-system/rewards-rpc/interfaces'
import type { AddRewardProgramRuleResponse }    from '@rewards-system/rewards-rpc/interfaces'
import type { UpdateRewardProgramRuleRequest }  from '@rewards-system/rewards-rpc/interfaces'
import type { UpdateRewardProgramRuleResponse } from '@rewards-system/rewards-rpc/interfaces'
import type { DeleteRewardProgramRuleRequest }  from '@rewards-system/rewards-rpc/interfaces'
import type { DeleteRewardProgramRuleResponse } from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardProgramsRequest }       from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardProgramsResponse }      from '@rewards-system/rewards-rpc/interfaces'
import type { CreateRewardProgramRequest }      from '@rewards-system/rewards-rpc/interfaces'
import type { CreateRewardProgramResponse }     from '@rewards-system/rewards-rpc/interfaces'
import type { UpdateRewardProgramRequest }      from '@rewards-system/rewards-rpc/interfaces'
import type { UpdateRewardProgramResponse }     from '@rewards-system/rewards-rpc/interfaces'

import { ConnectRpcMethod }                     from '@monstrs/nestjs-connectrpc'
import { ConnectRpcService }                    from '@monstrs/nestjs-connectrpc'
import { ConnectRpcExceptionsFilter }           from '@monstrs/nestjs-connectrpc-errors'
import { Validator }                            from '@monstrs/nestjs-validation'
import { UseFilters }                           from '@nestjs/common'
import { Controller }                           from '@nestjs/common'
import { QueryBus }                             from '@nestjs/cqrs'
import { CommandBus }                           from '@nestjs/cqrs'
import { v4 as uuid }                           from 'uuid'

import { GetRewardProgramsQuery }               from '@rewards-system/application-module'
import { GetRewardProgramByIdQuery }            from '@rewards-system/application-module'
import { CreateRewardProgramCommand }           from '@rewards-system/application-module'
import { UpdateRewardProgramCommand }           from '@rewards-system/application-module'
import { AddRewardProgramRuleCommand }          from '@rewards-system/application-module'
import { UpdateRewardProgramRuleCommand }       from '@rewards-system/application-module'
import { DeleteRewardProgramRuleCommand }       from '@rewards-system/application-module'
import { RewardProgramsService }                from '@rewards-system/rewards-rpc/connect'

import { ListRewardProgramsPayload }            from '../payloads/index.js'
import { CreateRewardProgramPayload }           from '../payloads/index.js'
import { UpdateRewardProgramPayload }           from '../payloads/index.js'
import { AddRewardProgramRulePayload }          from '../payloads/index.js'
import { UpdateRewardProgramRulePayload }       from '../payloads/index.js'
import { DeleteRewardProgramRulePayload }       from '../payloads/index.js'
import { ListRewardProgramsSerializer }         from '../serializers/index.js'
import { CreateRewardProgramSerializer }        from '../serializers/index.js'
import { UpdateRewardProgramSerializer }        from '../serializers/index.js'
import { AddRewardProgramRuleSerializer }       from '../serializers/index.js'
import { UpdateRewardProgramRuleSerializer }    from '../serializers/index.js'
import { DeleteRewardProgramRuleSerializer }    from '../serializers/index.js'

@Controller()
@ConnectRpcService(RewardProgramsService)
@UseFilters(ConnectRpcExceptionsFilter)
export class RewardProgramsController implements ServiceImpl<typeof RewardProgramsService> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @ConnectRpcMethod()
  async listRewardPrograms(
    request: ListRewardProgramsRequest
  ): Promise<ListRewardProgramsResponse> {
    const payload = new ListRewardProgramsPayload(request)

    await this.validator.validate(payload)

    return new ListRewardProgramsSerializer(
      await this.queryBus.execute<GetRewardProgramsQuery, FindRewardProgramsByQueryResult>(
        new GetRewardProgramsQuery(payload.pager, payload.order, payload.query)
      )
    )
  }

  @ConnectRpcMethod()
  async createRewardProgram(
    request: CreateRewardProgramRequest
  ): Promise<CreateRewardProgramResponse> {
    const payload = new CreateRewardProgramPayload(request)

    await this.validator.validate(payload)

    const command = new CreateRewardProgramCommand(
      uuid(),
      payload.name,
      payload.code,
      payload.percentage
    )

    await this.commandBus.execute(command)

    return new CreateRewardProgramSerializer(
      await this.queryBus.execute<GetRewardProgramByIdQuery, RewardProgram>(
        new GetRewardProgramByIdQuery(command.rewardProgramId)
      )
    )
  }

  @ConnectRpcMethod()
  async updateRewardProgram(
    request: UpdateRewardProgramRequest
  ): Promise<UpdateRewardProgramResponse> {
    const payload = new UpdateRewardProgramPayload(request)

    await this.validator.validate(payload)

    const command = new UpdateRewardProgramCommand(
      payload.rewardProgramId,
      payload.name,
      payload.percentage
    )

    await this.commandBus.execute(command)

    return new UpdateRewardProgramSerializer(
      await this.queryBus.execute<GetRewardProgramByIdQuery, RewardProgram>(
        new GetRewardProgramByIdQuery(command.rewardProgramId)
      )
    )
  }

  @ConnectRpcMethod()
  async addRewardProgramRule(
    request: AddRewardProgramRuleRequest
  ): Promise<AddRewardProgramRuleResponse> {
    const payload = new AddRewardProgramRulePayload(request)

    await this.validator.validate(payload)

    const command = new AddRewardProgramRuleCommand(
      uuid(),
      payload.rewardProgramId,
      payload.order,
      payload.name,
      payload.conditions,
      payload.fields
    )

    await this.commandBus.execute(command)

    return new AddRewardProgramRuleSerializer(
      await this.queryBus.execute<GetRewardProgramByIdQuery, RewardProgram>(
        new GetRewardProgramByIdQuery(command.rewardProgramId)
      )
    )
  }

  @ConnectRpcMethod()
  async updateRewardProgramRule(
    request: UpdateRewardProgramRuleRequest
  ): Promise<UpdateRewardProgramRuleResponse> {
    const payload = new UpdateRewardProgramRulePayload(request)

    await this.validator.validate(payload)

    const command = new UpdateRewardProgramRuleCommand(
      payload.rewardProgramRuleId,
      payload.rewardProgramId,
      payload.order,
      payload.name,
      payload.conditions,
      payload.fields
    )

    await this.commandBus.execute(command)

    return new UpdateRewardProgramRuleSerializer(
      await this.queryBus.execute<GetRewardProgramByIdQuery, RewardProgram>(
        new GetRewardProgramByIdQuery(command.rewardProgramId)
      )
    )
  }

  @ConnectRpcMethod()
  async deleteRewardProgramRule(
    request: DeleteRewardProgramRuleRequest
  ): Promise<DeleteRewardProgramRuleResponse> {
    const payload = new DeleteRewardProgramRulePayload(request)

    await this.validator.validate(payload)

    const command = new DeleteRewardProgramRuleCommand(
      payload.rewardProgramRuleId,
      payload.rewardProgramId
    )

    await this.commandBus.execute(command)

    return new DeleteRewardProgramRuleSerializer(
      await this.queryBus.execute<GetRewardProgramByIdQuery, RewardProgram>(
        new GetRewardProgramByIdQuery(command.rewardProgramId)
      )
    )
  }
}
