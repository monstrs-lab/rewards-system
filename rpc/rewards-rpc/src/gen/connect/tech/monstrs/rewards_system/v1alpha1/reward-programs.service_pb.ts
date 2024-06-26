// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file tech/monstrs/rewards_system/v1alpha1/reward-programs.service.proto (package tech.monstrs.rewards_system.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions } from '@bufbuild/protobuf'
import type { FieldList }         from '@bufbuild/protobuf'
import type { JsonReadOptions }   from '@bufbuild/protobuf'
import type { JsonValue }         from '@bufbuild/protobuf'
import type { PartialMessage }    from '@bufbuild/protobuf'
import type { PlainMessage }      from '@bufbuild/protobuf'

import { Message }                from '@bufbuild/protobuf'
import { Struct }                 from '@bufbuild/protobuf'
import { proto3 }                 from '@bufbuild/protobuf'

import { Query_ID }               from '../../queries/v1alpha1/queries_pb.js'
import { Query_Order }            from '../../queries/v1alpha1/queries_pb.js'
import { Query_Pager }            from '../../queries/v1alpha1/queries_pb.js'

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.RewardProgramField
 */
export class RewardProgramField extends Message<RewardProgramField> {
  /**
   * @generated from field: int32 percentage = 1;
   */
  percentage = 0

  /**
   * @generated from field: google.protobuf.Struct conditions = 2;
   */
  conditions?: Struct

  constructor(data?: PartialMessage<RewardProgramField>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.RewardProgramField'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'percentage', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: 'conditions', kind: 'message', T: Struct },
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RewardProgramField {
    return new RewardProgramField().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RewardProgramField {
    return new RewardProgramField().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): RewardProgramField {
    return new RewardProgramField().fromJsonString(jsonString, options)
  }

  static equals(
    a: RewardProgramField | PlainMessage<RewardProgramField> | undefined,
    b: RewardProgramField | PlainMessage<RewardProgramField> | undefined
  ): boolean {
    return proto3.util.equals(RewardProgramField, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.RewardProgramRule
 */
export class RewardProgramRule extends Message<RewardProgramRule> {
  /**
   * @generated from field: string id = 1;
   */
  id = ''

  /**
   * @generated from field: string name = 2;
   */
  name = ''

  /**
   * @generated from field: int32 order = 3;
   */
  order = 0

  /**
   * @generated from field: google.protobuf.Struct conditions = 4;
   */
  conditions?: Struct

  /**
   * @generated from field: repeated tech.monstrs.rewards_system.v1alpha1.RewardProgramField fields = 5;
   */
  fields: RewardProgramField[] = []

  constructor(data?: PartialMessage<RewardProgramRule>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.RewardProgramRule'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'order', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: 'conditions', kind: 'message', T: Struct },
    { no: 5, name: 'fields', kind: 'message', T: RewardProgramField, repeated: true },
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RewardProgramRule {
    return new RewardProgramRule().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RewardProgramRule {
    return new RewardProgramRule().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RewardProgramRule {
    return new RewardProgramRule().fromJsonString(jsonString, options)
  }

  static equals(
    a: RewardProgramRule | PlainMessage<RewardProgramRule> | undefined,
    b: RewardProgramRule | PlainMessage<RewardProgramRule> | undefined
  ): boolean {
    return proto3.util.equals(RewardProgramRule, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.RewardProgram
 */
export class RewardProgram extends Message<RewardProgram> {
  /**
   * @generated from field: string id = 1;
   */
  id = ''

  /**
   * @generated from field: string name = 2;
   */
  name = ''

  /**
   * @generated from field: string code = 3;
   */
  code = ''

  /**
   * @generated from field: int32 percentage = 4;
   */
  percentage = 0

  /**
   * @generated from field: repeated tech.monstrs.rewards_system.v1alpha1.RewardProgramRule rules = 5;
   */
  rules: RewardProgramRule[] = []

  constructor(data?: PartialMessage<RewardProgram>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.RewardProgram'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'code', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 4, name: 'percentage', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
    { no: 5, name: 'rules', kind: 'message', T: RewardProgramRule, repeated: true },
  ])

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RewardProgram {
    return new RewardProgram().fromBinary(bytes, options)
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RewardProgram {
    return new RewardProgram().fromJson(jsonValue, options)
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RewardProgram {
    return new RewardProgram().fromJsonString(jsonString, options)
  }

  static equals(
    a: RewardProgram | PlainMessage<RewardProgram> | undefined,
    b: RewardProgram | PlainMessage<RewardProgram> | undefined
  ): boolean {
    return proto3.util.equals(RewardProgram, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.CreateRewardProgramRequest
 */
export class CreateRewardProgramRequest extends Message<CreateRewardProgramRequest> {
  /**
   * @generated from field: string name = 1;
   */
  name = ''

  /**
   * @generated from field: string code = 2;
   */
  code = ''

  /**
   * @generated from field: int32 percentage = 3;
   */
  percentage = 0

  constructor(data?: PartialMessage<CreateRewardProgramRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.CreateRewardProgramRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'code', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'percentage', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): CreateRewardProgramRequest {
    return new CreateRewardProgramRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): CreateRewardProgramRequest {
    return new CreateRewardProgramRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): CreateRewardProgramRequest {
    return new CreateRewardProgramRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: CreateRewardProgramRequest | PlainMessage<CreateRewardProgramRequest> | undefined,
    b: CreateRewardProgramRequest | PlainMessage<CreateRewardProgramRequest> | undefined
  ): boolean {
    return proto3.util.equals(CreateRewardProgramRequest, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.CreateRewardProgramResponse
 */
export class CreateRewardProgramResponse extends Message<CreateRewardProgramResponse> {
  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.RewardProgram result = 1;
   */
  result?: RewardProgram

  constructor(data?: PartialMessage<CreateRewardProgramResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.CreateRewardProgramResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'result', kind: 'message', T: RewardProgram },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): CreateRewardProgramResponse {
    return new CreateRewardProgramResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): CreateRewardProgramResponse {
    return new CreateRewardProgramResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): CreateRewardProgramResponse {
    return new CreateRewardProgramResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: CreateRewardProgramResponse | PlainMessage<CreateRewardProgramResponse> | undefined,
    b: CreateRewardProgramResponse | PlainMessage<CreateRewardProgramResponse> | undefined
  ): boolean {
    return proto3.util.equals(CreateRewardProgramResponse, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.UpdateRewardProgramRequest
 */
export class UpdateRewardProgramRequest extends Message<UpdateRewardProgramRequest> {
  /**
   * @generated from field: string reward_program_id = 1;
   */
  rewardProgramId = ''

  /**
   * @generated from field: string name = 2;
   */
  name = ''

  /**
   * @generated from field: int32 percentage = 3;
   */
  percentage = 0

  constructor(data?: PartialMessage<UpdateRewardProgramRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.UpdateRewardProgramRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'reward_program_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'percentage', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): UpdateRewardProgramRequest {
    return new UpdateRewardProgramRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): UpdateRewardProgramRequest {
    return new UpdateRewardProgramRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): UpdateRewardProgramRequest {
    return new UpdateRewardProgramRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: UpdateRewardProgramRequest | PlainMessage<UpdateRewardProgramRequest> | undefined,
    b: UpdateRewardProgramRequest | PlainMessage<UpdateRewardProgramRequest> | undefined
  ): boolean {
    return proto3.util.equals(UpdateRewardProgramRequest, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.UpdateRewardProgramResponse
 */
export class UpdateRewardProgramResponse extends Message<UpdateRewardProgramResponse> {
  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.RewardProgram result = 1;
   */
  result?: RewardProgram

  constructor(data?: PartialMessage<UpdateRewardProgramResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.UpdateRewardProgramResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'result', kind: 'message', T: RewardProgram },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): UpdateRewardProgramResponse {
    return new UpdateRewardProgramResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): UpdateRewardProgramResponse {
    return new UpdateRewardProgramResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): UpdateRewardProgramResponse {
    return new UpdateRewardProgramResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: UpdateRewardProgramResponse | PlainMessage<UpdateRewardProgramResponse> | undefined,
    b: UpdateRewardProgramResponse | PlainMessage<UpdateRewardProgramResponse> | undefined
  ): boolean {
    return proto3.util.equals(UpdateRewardProgramResponse, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.AddRewardProgramRuleRequest
 */
export class AddRewardProgramRuleRequest extends Message<AddRewardProgramRuleRequest> {
  /**
   * @generated from field: string reward_program_id = 1;
   */
  rewardProgramId = ''

  /**
   * @generated from field: string name = 2;
   */
  name = ''

  /**
   * @generated from field: int32 order = 3;
   */
  order = 0

  /**
   * @generated from field: google.protobuf.Struct conditions = 4;
   */
  conditions?: Struct

  /**
   * @generated from field: repeated tech.monstrs.rewards_system.v1alpha1.RewardProgramField fields = 5;
   */
  fields: RewardProgramField[] = []

  constructor(data?: PartialMessage<AddRewardProgramRuleRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.AddRewardProgramRuleRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'reward_program_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'order', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: 'conditions', kind: 'message', T: Struct },
    { no: 5, name: 'fields', kind: 'message', T: RewardProgramField, repeated: true },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): AddRewardProgramRuleRequest {
    return new AddRewardProgramRuleRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): AddRewardProgramRuleRequest {
    return new AddRewardProgramRuleRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): AddRewardProgramRuleRequest {
    return new AddRewardProgramRuleRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: AddRewardProgramRuleRequest | PlainMessage<AddRewardProgramRuleRequest> | undefined,
    b: AddRewardProgramRuleRequest | PlainMessage<AddRewardProgramRuleRequest> | undefined
  ): boolean {
    return proto3.util.equals(AddRewardProgramRuleRequest, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.AddRewardProgramRuleResponse
 */
export class AddRewardProgramRuleResponse extends Message<AddRewardProgramRuleResponse> {
  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.RewardProgram result = 1;
   */
  result?: RewardProgram

  constructor(data?: PartialMessage<AddRewardProgramRuleResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.AddRewardProgramRuleResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'result', kind: 'message', T: RewardProgram },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): AddRewardProgramRuleResponse {
    return new AddRewardProgramRuleResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): AddRewardProgramRuleResponse {
    return new AddRewardProgramRuleResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): AddRewardProgramRuleResponse {
    return new AddRewardProgramRuleResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: AddRewardProgramRuleResponse | PlainMessage<AddRewardProgramRuleResponse> | undefined,
    b: AddRewardProgramRuleResponse | PlainMessage<AddRewardProgramRuleResponse> | undefined
  ): boolean {
    return proto3.util.equals(AddRewardProgramRuleResponse, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.UpdateRewardProgramRuleRequest
 */
export class UpdateRewardProgramRuleRequest extends Message<UpdateRewardProgramRuleRequest> {
  /**
   * @generated from field: string reward_program_rule_id = 1;
   */
  rewardProgramRuleId = ''

  /**
   * @generated from field: string reward_program_id = 2;
   */
  rewardProgramId = ''

  /**
   * @generated from field: string name = 3;
   */
  name = ''

  /**
   * @generated from field: int32 order = 4;
   */
  order = 0

  /**
   * @generated from field: google.protobuf.Struct conditions = 5;
   */
  conditions?: Struct

  /**
   * @generated from field: repeated tech.monstrs.rewards_system.v1alpha1.RewardProgramField fields = 6;
   */
  fields: RewardProgramField[] = []

  constructor(data?: PartialMessage<UpdateRewardProgramRuleRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.UpdateRewardProgramRuleRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'reward_program_rule_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'reward_program_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 4, name: 'order', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
    { no: 5, name: 'conditions', kind: 'message', T: Struct },
    { no: 6, name: 'fields', kind: 'message', T: RewardProgramField, repeated: true },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): UpdateRewardProgramRuleRequest {
    return new UpdateRewardProgramRuleRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): UpdateRewardProgramRuleRequest {
    return new UpdateRewardProgramRuleRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): UpdateRewardProgramRuleRequest {
    return new UpdateRewardProgramRuleRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: UpdateRewardProgramRuleRequest | PlainMessage<UpdateRewardProgramRuleRequest> | undefined,
    b: UpdateRewardProgramRuleRequest | PlainMessage<UpdateRewardProgramRuleRequest> | undefined
  ): boolean {
    return proto3.util.equals(UpdateRewardProgramRuleRequest, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.UpdateRewardProgramRuleResponse
 */
export class UpdateRewardProgramRuleResponse extends Message<UpdateRewardProgramRuleResponse> {
  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.RewardProgram result = 1;
   */
  result?: RewardProgram

  constructor(data?: PartialMessage<UpdateRewardProgramRuleResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.UpdateRewardProgramRuleResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'result', kind: 'message', T: RewardProgram },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): UpdateRewardProgramRuleResponse {
    return new UpdateRewardProgramRuleResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): UpdateRewardProgramRuleResponse {
    return new UpdateRewardProgramRuleResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): UpdateRewardProgramRuleResponse {
    return new UpdateRewardProgramRuleResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: UpdateRewardProgramRuleResponse | PlainMessage<UpdateRewardProgramRuleResponse> | undefined,
    b: UpdateRewardProgramRuleResponse | PlainMessage<UpdateRewardProgramRuleResponse> | undefined
  ): boolean {
    return proto3.util.equals(UpdateRewardProgramRuleResponse, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.DeleteRewardProgramRuleRequest
 */
export class DeleteRewardProgramRuleRequest extends Message<DeleteRewardProgramRuleRequest> {
  /**
   * @generated from field: string reward_program_rule_id = 1;
   */
  rewardProgramRuleId = ''

  /**
   * @generated from field: string reward_program_id = 2;
   */
  rewardProgramId = ''

  constructor(data?: PartialMessage<DeleteRewardProgramRuleRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.DeleteRewardProgramRuleRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'reward_program_rule_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'reward_program_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): DeleteRewardProgramRuleRequest {
    return new DeleteRewardProgramRuleRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): DeleteRewardProgramRuleRequest {
    return new DeleteRewardProgramRuleRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): DeleteRewardProgramRuleRequest {
    return new DeleteRewardProgramRuleRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: DeleteRewardProgramRuleRequest | PlainMessage<DeleteRewardProgramRuleRequest> | undefined,
    b: DeleteRewardProgramRuleRequest | PlainMessage<DeleteRewardProgramRuleRequest> | undefined
  ): boolean {
    return proto3.util.equals(DeleteRewardProgramRuleRequest, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.DeleteRewardProgramRuleResponse
 */
export class DeleteRewardProgramRuleResponse extends Message<DeleteRewardProgramRuleResponse> {
  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.RewardProgram result = 1;
   */
  result?: RewardProgram

  constructor(data?: PartialMessage<DeleteRewardProgramRuleResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.DeleteRewardProgramRuleResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'result', kind: 'message', T: RewardProgram },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): DeleteRewardProgramRuleResponse {
    return new DeleteRewardProgramRuleResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): DeleteRewardProgramRuleResponse {
    return new DeleteRewardProgramRuleResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): DeleteRewardProgramRuleResponse {
    return new DeleteRewardProgramRuleResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: DeleteRewardProgramRuleResponse | PlainMessage<DeleteRewardProgramRuleResponse> | undefined,
    b: DeleteRewardProgramRuleResponse | PlainMessage<DeleteRewardProgramRuleResponse> | undefined
  ): boolean {
    return proto3.util.equals(DeleteRewardProgramRuleResponse, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.ListRewardProgramsRequest
 */
export class ListRewardProgramsRequest extends Message<ListRewardProgramsRequest> {
  /**
   * @generated from field: tech.monstrs.queries.v1alpha1.Query.Pager pager = 1;
   */
  pager?: Query_Pager

  /**
   * @generated from field: tech.monstrs.queries.v1alpha1.Query.Order order = 2;
   */
  order?: Query_Order

  /**
   * @generated from field: tech.monstrs.rewards_system.v1alpha1.ListRewardProgramsRequest.RewardProgramsQuery query = 3;
   */
  query?: ListRewardProgramsRequest_RewardProgramsQuery

  constructor(data?: PartialMessage<ListRewardProgramsRequest>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.ListRewardProgramsRequest'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'pager', kind: 'message', T: Query_Pager },
    { no: 2, name: 'order', kind: 'message', T: Query_Order },
    { no: 3, name: 'query', kind: 'message', T: ListRewardProgramsRequest_RewardProgramsQuery },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): ListRewardProgramsRequest {
    return new ListRewardProgramsRequest().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): ListRewardProgramsRequest {
    return new ListRewardProgramsRequest().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): ListRewardProgramsRequest {
    return new ListRewardProgramsRequest().fromJsonString(jsonString, options)
  }

  static equals(
    a: ListRewardProgramsRequest | PlainMessage<ListRewardProgramsRequest> | undefined,
    b: ListRewardProgramsRequest | PlainMessage<ListRewardProgramsRequest> | undefined
  ): boolean {
    return proto3.util.equals(ListRewardProgramsRequest, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.ListRewardProgramsRequest.RewardProgramsQuery
 */
export class ListRewardProgramsRequest_RewardProgramsQuery extends Message<ListRewardProgramsRequest_RewardProgramsQuery> {
  /**
   * @generated from field: tech.monstrs.queries.v1alpha1.Query.ID id = 1;
   */
  id?: Query_ID

  constructor(data?: PartialMessage<ListRewardProgramsRequest_RewardProgramsQuery>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName =
    'tech.monstrs.rewards_system.v1alpha1.ListRewardProgramsRequest.RewardProgramsQuery'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'id', kind: 'message', T: Query_ID },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): ListRewardProgramsRequest_RewardProgramsQuery {
    return new ListRewardProgramsRequest_RewardProgramsQuery().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): ListRewardProgramsRequest_RewardProgramsQuery {
    return new ListRewardProgramsRequest_RewardProgramsQuery().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): ListRewardProgramsRequest_RewardProgramsQuery {
    return new ListRewardProgramsRequest_RewardProgramsQuery().fromJsonString(jsonString, options)
  }

  static equals(
    a:
      | ListRewardProgramsRequest_RewardProgramsQuery
      | PlainMessage<ListRewardProgramsRequest_RewardProgramsQuery>
      | undefined,
    b:
      | ListRewardProgramsRequest_RewardProgramsQuery
      | PlainMessage<ListRewardProgramsRequest_RewardProgramsQuery>
      | undefined
  ): boolean {
    return proto3.util.equals(ListRewardProgramsRequest_RewardProgramsQuery, a, b)
  }
}

/**
 * @generated from message tech.monstrs.rewards_system.v1alpha1.ListRewardProgramsResponse
 */
export class ListRewardProgramsResponse extends Message<ListRewardProgramsResponse> {
  /**
   * @generated from field: repeated tech.monstrs.rewards_system.v1alpha1.RewardProgram reward_programs = 1;
   */
  rewardPrograms: RewardProgram[] = []

  /**
   * @generated from field: bool has_next_page = 2;
   */
  hasNextPage = false

  constructor(data?: PartialMessage<ListRewardProgramsResponse>) {
    super()
    proto3.util.initPartial(data, this)
  }

  static readonly runtime: typeof proto3 = proto3
  static readonly typeName = 'tech.monstrs.rewards_system.v1alpha1.ListRewardProgramsResponse'
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'reward_programs', kind: 'message', T: RewardProgram, repeated: true },
    { no: 2, name: 'has_next_page', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
  ])

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): ListRewardProgramsResponse {
    return new ListRewardProgramsResponse().fromBinary(bytes, options)
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): ListRewardProgramsResponse {
    return new ListRewardProgramsResponse().fromJson(jsonValue, options)
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): ListRewardProgramsResponse {
    return new ListRewardProgramsResponse().fromJsonString(jsonString, options)
  }

  static equals(
    a: ListRewardProgramsResponse | PlainMessage<ListRewardProgramsResponse> | undefined,
    b: ListRewardProgramsResponse | PlainMessage<ListRewardProgramsResponse> | undefined
  ): boolean {
    return proto3.util.equals(ListRewardProgramsResponse, a, b)
  }
}
