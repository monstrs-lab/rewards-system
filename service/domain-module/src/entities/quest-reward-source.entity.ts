import { Guard }   from '@monstrs/guard-clause'
import { Against } from '@monstrs/guard-clause'

export class QuestRewardSource {
  #id!: string

  #type!: string

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get type(): string {
    return this.#type
  }

  private set type(type: string) {
    this.#type = type
  }

  @Guard()
  static create(
    @Against('id').NotUUID(4) id: string,
    @Against('type').Empty() type: string
  ): QuestRewardSource {
    const questRewardSource = new QuestRewardSource()

    questRewardSource.id = id
    questRewardSource.type = type

    return questRewardSource
  }
}
