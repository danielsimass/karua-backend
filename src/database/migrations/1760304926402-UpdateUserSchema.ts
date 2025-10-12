import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserSchema1760304926402 implements MigrationInterface {
    name = 'UpdateUserSchema1760304926402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "fk_users_host_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_email"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_username"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_host_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_role"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "unique_user_email_per_host"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "unique_user_username_per_host"`);
        await queryRunner.query(`CREATE TYPE "public"."customer_documents_type_enum" AS ENUM('cpf', 'rg', 'cnh', 'passport', 'dni', 'cedula', 'ruc', 'ci', 'mercosul_id', 'other')`);
        await queryRunner.query(`CREATE TABLE "customer_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" uuid NOT NULL, "document" character varying(50) NOT NULL, "type" "public"."customer_documents_type_enum" NOT NULL, "issuing_country" character varying(3), "is_primary" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ccc82daa515b50e68a76f343417" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."customer_contacts_type_enum" AS ENUM('phone', 'mobile', 'whatsapp', 'email', 'other')`);
        await queryRunner.query(`CREATE TABLE "customer_contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" uuid NOT NULL, "value" character varying(100) NOT NULL, "type" "public"."customer_contacts_type_enum" NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bde619dbcb45a3e4d542e137bd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."customers_gender_enum" AS ENUM('male', 'female', 'other', 'not_informed')`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "birth_date" date, "gender" "public"."customers_gender_enum", "nationality_id" uuid, "host_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nationalities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_aaa94322d4f245f4fa3c3d591fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."role_type_enum" RENAME TO "role_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'manager', 'receptionist', 'staff')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'staff'`);
        await queryRunner.query(`DROP TYPE "public"."role_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9306e07fdcc3684eb6e1e0e405a" FOREIGN KEY ("host_id") REFERENCES "hosts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_documents" ADD CONSTRAINT "FK_5301fb44d91d7a9102f12fba583" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_contacts" ADD CONSTRAINT "FK_76ca61fed7339b9f358599f9fda" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_f58c6b7a98fc75211f8378d1581" FOREIGN KEY ("nationality_id") REFERENCES "nationalities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_01df38539299562c3f24ee6a0ac" FOREIGN KEY ("host_id") REFERENCES "hosts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_01df38539299562c3f24ee6a0ac"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_f58c6b7a98fc75211f8378d1581"`);
        await queryRunner.query(`ALTER TABLE "customer_contacts" DROP CONSTRAINT "FK_76ca61fed7339b9f358599f9fda"`);
        await queryRunner.query(`ALTER TABLE "customer_documents" DROP CONSTRAINT "FK_5301fb44d91d7a9102f12fba583"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9306e07fdcc3684eb6e1e0e405a"`);
        await queryRunner.query(`CREATE TYPE "public"."role_type_enum_old" AS ENUM('admin', 'manager', 'receptionist', 'staff')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."role_type_enum_old" USING "role"::"text"::"public"."role_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'staff'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."role_type_enum_old" RENAME TO "role_type_enum"`);
        await queryRunner.query(`DROP TABLE "nationalities"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TYPE "public"."customers_gender_enum"`);
        await queryRunner.query(`DROP TABLE "customer_contacts"`);
        await queryRunner.query(`DROP TYPE "public"."customer_contacts_type_enum"`);
        await queryRunner.query(`DROP TABLE "customer_documents"`);
        await queryRunner.query(`DROP TYPE "public"."customer_documents_type_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "unique_user_username_per_host" UNIQUE ("username", "host_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "unique_user_email_per_host" UNIQUE ("email", "host_id")`);
        await queryRunner.query(`CREATE INDEX "idx_users_role" ON "users" ("role") `);
        await queryRunner.query(`CREATE INDEX "idx_users_host_id" ON "users" ("host_id") `);
        await queryRunner.query(`CREATE INDEX "idx_users_username" ON "users" ("username") `);
        await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "fk_users_host_id" FOREIGN KEY ("host_id") REFERENCES "hosts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
