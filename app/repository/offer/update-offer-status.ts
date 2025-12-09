import prisma from "app/db.server";

export const updateOfferStatus = async (
  offerId: string,
  status: "active" | "draft",
  merchantId: number
) => {
  const offer = await prisma.offer.findFirst({
    where: { id: offerId, merchantId },
  });

  if (!offer) {
    throw new Error("Offer not found or access denied");
  }

  return await prisma.offer.update({
    where: { id: offerId },
    data: { status },
  });
};
