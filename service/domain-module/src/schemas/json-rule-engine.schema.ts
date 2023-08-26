export const schema = {
  $id: 'https://monstrs.tech/referral-programs/schema.json',
  $ref: 'defs.json#/definitions/top',
}

export const defs = {
  $id: 'https://monstrs.tech/referral-programs/defs.json',
  definitions: {
    props: {
      type: 'object',
      properties: {
        fact: {
          type: 'string',
        },
        operator: {
          type: 'string',
        },
        value: {
          oneOf: [
            {
              type: 'string',
            },
            {
              type: 'number',
            },
            {
              type: 'boolean',
            },
            {
              type: 'array',
            },
          ],
        },
        path: {
          type: 'string',
        },
        priority: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
      },
      required: ['fact', 'operator', 'value'],
    },
    all: {
      type: 'object',
      properties: {
        all: {
          type: 'array',
          items: {
            $ref: '#/definitions/nested',
          },
        },
        name: {
          type: 'string',
        },
        priority: {
          type: 'number',
        },
      },
      required: ['all'],
    },
    any: {
      type: 'object',
      properties: {
        any: {
          type: 'array',
          items: {
            $ref: '#/definitions/nested',
          },
        },
        name: {
          type: 'string',
        },
        priority: {
          type: 'number',
        },
      },
      required: ['any'],
    },
    not: {
      type: 'object',
      properties: {
        not: {
          $ref: '#/definitions/nested',
        },
        name: {
          type: 'string',
        },
        priority: {
          type: 'number',
        },
      },
      required: ['not'],
    },
    top: {
      oneOf: [
        {
          $ref: '#/definitions/all',
        },
        {
          $ref: '#/definitions/any',
        },
        {
          $ref: '#/definitions/not',
        },
      ],
    },
    nested: {
      oneOf: [
        {
          $ref: '#/definitions/props',
        },
        {
          $ref: '#/definitions/top',
        },
      ],
    },
  },
}
