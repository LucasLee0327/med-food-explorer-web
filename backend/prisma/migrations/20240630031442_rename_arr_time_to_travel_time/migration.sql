/*
  Warnings:

  - You are about to drop the column `arr_time` on the `candidate` table. All the data in the column will be lost.
  - You are about to drop the column `arr_time` on the `food` table. All the data in the column will be lost.
  - Added the required column `travelTime` to the `food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "candidate" DROP COLUMN "arr_time";

-- AlterTable
ALTER TABLE "food" DROP COLUMN "arr_time",
ADD COLUMN     "travelTime" INTEGER NOT NULL;
