/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_authorId_fkey";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "arr_time" TEXT NOT NULL,

    CONSTRAINT "food_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "food_name_key" ON "food"("name");
