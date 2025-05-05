/*
  Warnings:

  - You are about to drop the `ProblemAtribute` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `codeSnippets` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examples` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceSolutions` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testcases` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProblemAtribute" DROP CONSTRAINT "ProblemAtribute_problemId_fkey";

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "codeSnippets" JSONB NOT NULL,
ADD COLUMN     "examples" JSONB NOT NULL,
ADD COLUMN     "referenceSolutions" JSONB NOT NULL,
ADD COLUMN     "testcases" JSONB NOT NULL;

-- DropTable
DROP TABLE "ProblemAtribute";

-- DropEnum
DROP TYPE "ProblemAtributeType";
