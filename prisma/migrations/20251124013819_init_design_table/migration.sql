-- CreateTable
CREATE TABLE "Design" (
    "id" SERIAL NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "mobileSettings" JSONB NOT NULL,
    "desktopSettings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Design_merchantId_key" ON "Design"("merchantId");

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
