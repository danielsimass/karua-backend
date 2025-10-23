import { MigrationInterface, QueryRunner } from "typeorm";

export class TurnPasswardOptional1760449628316 implements MigrationInterface {
    name = 'TurnPasswardOptional1760449628316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    }

}
