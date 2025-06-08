-- CreateTable
CREATE TABLE "dating_plan" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,

    CONSTRAINT "dating_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dating_plan_senderId_idx" ON "dating_plan"("senderId");

-- CreateIndex
CREATE INDEX "dating_plan_receiverId_idx" ON "dating_plan"("receiverId");

-- AddForeignKey
ALTER TABLE "dating_plan" ADD CONSTRAINT "dating_plan_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dating_plan" ADD CONSTRAINT "dating_plan_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
