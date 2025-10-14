import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueIndexHostCnpj1760445707447 implements MigrationInterface {
    name = 'AddUniqueIndexHostCnpj1760445707447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89b5e144d1c41837e864c63045" ON "hosts" ("cnpj") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_89b5e144d1c41837e864c63045"`);
    }

}
