import { Migration } from '@mikro-orm/migrations'

export class Migration20230829114448 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'create table "referral_operations" ("id" uuid not null, "referral_program_id" uuid not null, "referrer_id" uuid not null, "status" smallint not null default 0, "source_id" uuid not null, "source_type" varchar(255) not null, "amount" numeric(12,2) not null, "created_at" timestamptz(0) not null, constraint "referral_operations_pkey" primary key ("id"));'
    )
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "referral_operations" cascade;')
  }
}
