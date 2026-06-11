import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781049600000 implements MigrationInterface {
    name = 'Migration1781049600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add unique constraint to user.username
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_user_username" UNIQUE ("username")`);

        // Convert giveaway.completionStatus from varchar to a proper enum type
        // Must drop the varchar default before altering the column type, then re-add it as an enum literal
        await queryRunner.query(`ALTER TABLE "giveaway" ALTER COLUMN "completionStatus" DROP DEFAULT`);
        await queryRunner.query(`CREATE TYPE "public"."giveaway_completionstatus_enum" AS ENUM('not_processed', 'pending', 'processed', 'failed')`);
        await queryRunner.query(`ALTER TABLE "giveaway" ALTER COLUMN "completionStatus" TYPE "public"."giveaway_completionstatus_enum" USING "completionStatus"::"public"."giveaway_completionstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "giveaway" ALTER COLUMN "completionStatus" SET DEFAULT 'not_processed'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "giveaway" ALTER COLUMN "completionStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "giveaway" ALTER COLUMN "completionStatus" TYPE character varying USING "completionStatus"::character varying`);
        await queryRunner.query(`ALTER TABLE "giveaway" ALTER COLUMN "completionStatus" SET DEFAULT 'not_processed'`);
        await queryRunner.query(`DROP TYPE "public"."giveaway_completionstatus_enum"`);

        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_user_username"`);
    }
}
