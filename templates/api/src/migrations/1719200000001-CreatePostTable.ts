import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostTable1719200000001 implements MigrationInterface {
  name = "CreatePostTable1719200000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "post" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "published" boolean NOT NULL DEFAULT false,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "authorId" uuid NOT NULL,
        CONSTRAINT "PK_post_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "post"
      ADD CONSTRAINT "FK_post_authorId" FOREIGN KEY ("authorId")
      REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_post_authorId"`);
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
