/*
  Warnings:

  - The values [JUNIOR,LADIES] on the enum `Target` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Target_new" AS ENUM ('ALL', 'BOYS', 'BOYS_A', 'BOYS_B', 'GIRLS', 'GIRLS_A', 'GIRLS_B');
ALTER TYPE "Target" RENAME TO "Target_old";
ALTER TYPE "Target_new" RENAME TO "Target";
DROP TYPE "public"."Target_old";
COMMIT;
