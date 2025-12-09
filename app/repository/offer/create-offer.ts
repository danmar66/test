import prisma from "../../db.server";
import { validateAndPreparePayloadCreate } from "../../utils/validateAndPrepareOfferPayload";

export default async function createOffer(
  payloadData: unknown,
  merchantId: number
) {

  const data = validateAndPreparePayloadCreate(payloadData, merchantId);

  return prisma.offer.create({
    data
  });
}
