import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccomodationsTables1761910815334 implements MigrationInterface {
    name = 'CreateAccomodationsTables1761910815334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accommodation_pricing_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accommodation_type_id" uuid NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "price" numeric(18,6) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_967c5c0848e0558898a56c7998b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accommodation_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "capacity" integer NOT NULL, "rooms" integer NOT NULL, "bathrooms" integer NOT NULL, "min_occupants" integer NOT NULL DEFAULT '1', "max_occupants" integer NOT NULL, "host_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9b09f2b9ad0f54187bf128002f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_accommodation_types_host_id" ON "accommodation_types" ("host_id") `);
        await queryRunner.query(`CREATE TABLE "accommodations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accommodation_type_id" uuid NOT NULL, "identifier" character varying(50) NOT NULL, "floor" integer, "status" boolean NOT NULL DEFAULT true, "host_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a422a200297f93cd5ac87d049e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_accommodations_host_id" ON "accommodations" ("host_id") `);
        await queryRunner.query(`ALTER TABLE "accommodation_pricing_schedules" ADD CONSTRAINT "FK_2a11adcc0e95585e3ff4a062a3b" FOREIGN KEY ("accommodation_type_id") REFERENCES "accommodation_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accommodation_types" ADD CONSTRAINT "FK_ded297c20b85bab0d5165f5624d" FOREIGN KEY ("host_id") REFERENCES "hosts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD CONSTRAINT "FK_30bd119445900ba68712dd5ed06" FOREIGN KEY ("accommodation_type_id") REFERENCES "accommodation_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD CONSTRAINT "FK_9c5ac9535f8d1c61da695053502" FOREIGN KEY ("host_id") REFERENCES "hosts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accommodations" DROP CONSTRAINT "FK_9c5ac9535f8d1c61da695053502"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP CONSTRAINT "FK_30bd119445900ba68712dd5ed06"`);
        await queryRunner.query(`ALTER TABLE "accommodation_types" DROP CONSTRAINT "FK_ded297c20b85bab0d5165f5624d"`);
        await queryRunner.query(`ALTER TABLE "accommodation_pricing_schedules" DROP CONSTRAINT "FK_2a11adcc0e95585e3ff4a062a3b"`);
        await queryRunner.query(`DROP INDEX "public"."idx_accommodations_host_id"`);
        await queryRunner.query(`DROP TABLE "accommodations"`);
        await queryRunner.query(`DROP INDEX "public"."idx_accommodation_types_host_id"`);
        await queryRunner.query(`DROP TABLE "accommodation_types"`);
        await queryRunner.query(`DROP TABLE "accommodation_pricing_schedules"`);
    }

}
