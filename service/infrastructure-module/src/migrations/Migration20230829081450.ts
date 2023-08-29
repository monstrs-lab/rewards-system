import { Migration } from '@mikro-orm/migrations'

export class Migration20230829081450 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'create table "referral_agents" ("id" uuid not null, "code" varchar(255) not null, "parent_id" uuid null, "path" ltree null, "metadata" jsonb not null default \'{}\', constraint "referral_agents_pkey" primary key ("id"));'
    )
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "referral_agents" cascade;')
  }
}
