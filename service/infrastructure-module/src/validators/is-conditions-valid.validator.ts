import type { ValidationOptions }            from 'class-validator'
import type { ValidatorConstraintInterface } from 'class-validator'

import { ValidatorConstraint }               from 'class-validator'
import { registerDecorator }                 from 'class-validator'
import AjvPkg                                from 'ajv'

import { jsonRulesEngineSchema }             from '@rewards-system/domain-module'

const Ajv = AjvPkg.default || AjvPkg

@ValidatorConstraint({ async: true })
export class IsConditionsValidConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(value: any): boolean {
    const ajv = new Ajv()

    ajv.addSchema(jsonRulesEngineSchema.defs)

    const validate = ajv.compile(jsonRulesEngineSchema.schema)

    return validate(value)
  }

  defaultMessage(): string {
    return 'Invalid conditions schema'
  }
}

export const IsConditionsValid = (options?: ValidationOptions) =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  (object: Object, propertyName: string): void => {
    registerDecorator({
      validator: IsConditionsValidConstraint,
      target: object.constructor,
      constraints: [],
      propertyName,
      options,
    })
  }
