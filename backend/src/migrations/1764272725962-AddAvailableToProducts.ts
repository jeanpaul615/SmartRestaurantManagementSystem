import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvailableToProducts1764272725962 implements MigrationInterface {
        public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_PRODUCT_Available" ON "products" ("available")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCT_Available"`);
    }
}