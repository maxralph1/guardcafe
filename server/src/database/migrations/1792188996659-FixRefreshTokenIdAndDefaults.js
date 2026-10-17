/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class FixRefreshTokenIdAndDefaults1792188996659 {
    name = 'FixRefreshTokenIdAndDefaults1792188996659'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "payroll_entries" ALTER COLUMN "currency_code" SET DEFAULT 'mur'`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payroll_entries" ALTER COLUMN "currency_code" DROP DEFAULT`);
    }
}
