import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1780657700190 implements MigrationInterface {
    name = 'Migration1780657700190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "giveaway" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dino" json NOT NULL, "isCanceled" boolean NOT NULL DEFAULT false, "activeAt" TIMESTAMP WITH TIME ZONE, "trials" json, "server" character varying, "slot" character varying, "completionStatus" character varying NOT NULL DEFAULT 'not_processed', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "creatorId" uuid, "recipientId" uuid, CONSTRAINT "PK_fdbebb79a049e10c16e3df5d447" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Regular', 'Operator', 'Admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'Regular', "tokenVersion" integer NOT NULL DEFAULT '0', "isPublic" boolean NOT NULL DEFAULT true, "apiId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "giveaway" ADD CONSTRAINT "FK_754723f4cdaf7ccecb8bf87c9cd" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "giveaway" ADD CONSTRAINT "FK_8700279a3220c8fd3577da3496f" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "giveaway" DROP CONSTRAINT "FK_8700279a3220c8fd3577da3496f"`);
        await queryRunner.query(`ALTER TABLE "giveaway" DROP CONSTRAINT "FK_754723f4cdaf7ccecb8bf87c9cd"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "giveaway"`);
    }

}
