import { MigrationInterface, QueryRunner } from "typeorm";

export class First1706571907471 implements MigrationInterface {
    name = 'First1706571907471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fav_character" ("id" SERIAL NOT NULL, "characterId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_1d64acfbabcd32169f986df44b0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "fav_character"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
