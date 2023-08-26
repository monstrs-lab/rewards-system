import { Migration } from '@mikro-orm/migrations'

export class Migration20230826202523 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'create table "referral_programs" ("id" uuid not null, "code" varchar(255) not null, "name" varchar(255) not null, "percentage" int not null, constraint "referral_programs_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "referral_program_rules" ("id" uuid not null, "name" varchar(255) not null, "order" int not null, "conditions" jsonb not null default \'{}\', "fields" jsonb not null default \'{}\', "program_id" uuid not null, constraint "referral_program_rules_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table "referral_program_rules" add constraint "referral_program_rules_program_id_foreign" foreign key ("program_id") references "referral_programs" ("id") on update cascade;'
    )
  }
}
