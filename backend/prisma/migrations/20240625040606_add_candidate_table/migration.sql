-- CreateTable
CREATE TABLE "candidate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "arr_time" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '尚未上傳地址QwQ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_pkey" PRIMARY KEY ("id")
);
