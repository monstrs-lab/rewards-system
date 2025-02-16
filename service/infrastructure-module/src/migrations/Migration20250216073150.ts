import { Migration } from '@mikro-orm/migrations'

export class Migration20250216073150 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "quest_rewards" ("id" uuid not null, "status" smallint not null default 0, "recipient_id" uuid not null, "source_id" uuid not null, "source_type" varchar(255) not null, "amount" numeric(12,2) not null, "created_at" timestamptz(0) not null, constraint "quest_rewards_pkey" primary key ("id"));'
    )
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "quest_rewards" cascade;')
  }
}
