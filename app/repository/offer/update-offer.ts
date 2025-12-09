import prisma from "../../db.server";
import { validateAndPreparePayloadUpdate } from "../../utils/validateAndPrepareOfferPayload";

export default async function updateOffer(
  offerId: string,
  payloadData: unknown,
  merchantId: number
) {
  const data = validateAndPreparePayloadUpdate(payloadData);

  return prisma.offer.update({
    where: { id: offerId, merchantId },
    data
  });
}
