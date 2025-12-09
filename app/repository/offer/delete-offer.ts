import prisma from "app/db.server";

export const deleteOffer = async (offerId: string, merchantId: number) => {
  const offer = await prisma.offer.findFirst({
    where: { id: offerId, merchantId },
  });

  if (!offer) {
    throw new Error("Offer not found or access denied");
  }

  return await prisma.offer.delete({
    where: { id: offerId },
  });
};
