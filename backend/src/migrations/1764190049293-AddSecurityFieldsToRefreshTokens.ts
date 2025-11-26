import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSecurityFieldsToRefreshTokens1764220000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columnas de seguridad faltantes
    await queryRunner.query(`
            ALTER TABLE "refresh_tokens" 
            ADD COLUMN "ipAddress" character varying
        `);

    await queryRunner.query(`
            ALTER TABLE "refresh_tokens" 
            ADD COLUMN "userAgent" text
        `);

    await queryRunner.query(`
            ALTER TABLE "refresh_tokens" 
            ADD COLUMN "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

    console.log('✅ Columnas de seguridad agregadas a refresh_tokens');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "userAgent"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "ipAddress"`);
  }
}
