import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHostsAndLegalRepresentatives1759437038497 implements MigrationInterface {
    name = 'CreateHostsAndLegalRepresentatives1759437038497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hosts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "cnpj" character varying(18), "cep" character varying(10), "street" character varying(255), "number" character varying(20), "state" character varying(2), "phone" character varying(20), "email" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c4bcf0826e0e2847faee4da1746" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "legal_representatives" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "cpf" character varying(14) NOT NULL, "phone" character varying(20), "host_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f33adfbb24667139dec2f9ca5e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "legal_representatives" ADD CONSTRAINT "FK_d4d5f3888f9980604b2f3a0a28c" FOREIGN KEY ("host_id") REFERENCES "hosts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal_representatives" DROP CONSTRAINT "FK_d4d5f3888f9980604b2f3a0a28c"`);
        await queryRunner.query(`DROP TABLE "legal_representatives"`);
        await queryRunner.query(`DROP TABLE "hosts"`);
    }

}
