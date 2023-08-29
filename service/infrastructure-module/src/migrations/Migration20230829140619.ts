import { Migration } from '@mikro-orm/migrations'

export class Migration20230829140619 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'create table "referral_profits" ("id" uuid not null, "status" smallint not null default 0, "operation_id" uuid not null, "agent_id" uuid not null, "referrer_id" uuid not null, "level" int not null, "amount" numeric(12,2) not null, "profit" numeric(12,2) not null, "percentage" int not null, "created_at" timestamptz(0) not null, constraint "referral_profits_pkey" primary key ("id"));'
    )
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "referral_profits" cascade;')
  }
}
