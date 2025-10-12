import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndRoles1759437100000 implements MigrationInterface {
  name = 'CreateUsersAndRoles1759437100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create role enum type
    await queryRunner.query(`
      CREATE TYPE "role_type_enum" AS ENUM ('admin', 'manager', 'receptionist', 'staff')
    `);

    // Create users table with role as enum
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "username" VARCHAR(100) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "role" "role_type_enum" NOT NULL DEFAULT 'staff',
        "host_id" uuid NOT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "fk_users_host_id" 
      FOREIGN KEY ("host_id") REFERENCES "hosts"("id") 
      ON DELETE RESTRICT
    `);

    // Add unique constraints
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "unique_user_email_per_host" 
      UNIQUE ("email", "host_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "unique_user_username_per_host" 
      UNIQUE ("username", "host_id")
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "idx_users_email" ON "users"("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_users_username" ON "users"("username")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_users_host_id" ON "users"("host_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_users_role" ON "users"("role")
    `);

    // Get the first host ID or create a default one
    let hosts = await queryRunner.query(`SELECT id FROM "hosts" LIMIT 1`);

    // If no host exists, create a default one
    if (hosts.length === 0) {
      await queryRunner.query(`
        INSERT INTO "hosts" ("name", "description", "is_active")
        VALUES ('Hotel Padrão', 'Hotel criado automaticamente pelo sistema', true)
      `);
      hosts = await queryRunner.query(`SELECT id FROM "hosts" LIMIT 1`);
    }

    const hostId = hosts[0].id;

    // Insert default admin user
    // Password: Admin@123 (hashed with bcrypt, 10 rounds)
    // ⚠️ IMPORTANTE: Altere esta senha após o primeiro login!
    await queryRunner.query(`
      INSERT INTO "users" ("name", "email", "username", "password", "role", "host_id", "is_active") 
      VALUES (
        'System Admin',
        'admin@karua.com',
        'admin',
        '$2b$10$NU3.z4IjkPzhsNo0NudjT.AHQ4iWUgZtWTtd1ObcCkGYCeMi1Ti1K',
        'admin',
        '${hostId}',
        true
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_role"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_host_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_username"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_email"`);

    // Drop constraints
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "unique_user_username_per_host"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "unique_user_email_per_host"`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "fk_users_host_id"`);

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    // Drop enum type
    await queryRunner.query(`DROP TYPE IF EXISTS "role_type_enum"`);
  }
}
