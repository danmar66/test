-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "offerName" TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    "triggerCondition" TEXT NOT NULL,
    "minQuantity" INTEGER,
    "maxQuantity" INTEGER,
    "minAmount" DOUBLE PRECISION,
    "maxAmount" DOUBLE PRECISION,
    "rewardAction" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" INTEGER NOT NULL,
    "scheduleType" TEXT NOT NULL,
    "hasEndDate" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "startTime" TEXT,
    "endDate" TIMESTAMP(3),
    "endTime" TEXT,
    "selectedTriggerProducts" JSONB,
    "selectedTriggerCollections" JSONB,
    "selectedRewardProducts" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
