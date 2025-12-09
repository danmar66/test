import OfferForm from "./components/OfferForm/OfferForm";
import {ActionFunctionArgs, data, LoaderFunctionArgs, redirect, useLoaderData} from "react-router";
import {requireMerchantFromAdmin} from "../../service/require-merchant-from-admin";
import prisma from "../../db.server";
import {Prisma} from "@prisma/client";
import {splitDateAndTime} from "../../utils/splitDateAndTime";
import updateOffer from "../../repository/offer/update-offer";
import createOffer from "../../repository/offer/create-offer";
import {OfferSchema} from "../../schemas/offer";
import {combineDateAndTime} from "../../utils/combineDateAndTime";

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const {offerId} = params;

  const {merchant} = await requireMerchantFromAdmin(request);
  if (!merchant) {
    throw redirect("/auth/login");
  }

  if (!offerId || offerId === "new") {
    return data({success: true, shop: merchant.shop, offer: null});
  }

  const offer = offerId
    ? await prisma.offer.findUnique({where: {id: offerId, merchantId: merchant.id}})
    : null;

  if (!offer) {
    throw new Response("Offer not found", {status: 404});
  }

  const {date: startDate, time: startTime} = splitDateAndTime(offer.startAt);
  const {date: endDate, time: endTime} = splitDateAndTime(offer.endAt);

  console.log("offer", JSON.stringify(offer));

  return data({
    success: true,
    shop: merchant.shop,
    offer: {...offer, startDate, startTime, endDate, endTime, hasEndDate: Boolean(endDate)},
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  let payloadData;
  try {
    payloadData = await request.json();
  } catch (error) {
    return data({ error: "Invalid JSON payload" }, { status: 400 });
  }

  console.log("payloadData", payloadData);

  const { merchant } = await requireMerchantFromAdmin(request);
  if (!merchant) throw redirect("/auth/login");

  const parsed = OfferSchema.safeParse(payloadData);
  if (!parsed.success) {
    return data({ errors: parsed.error.issues }, { status: 400 });
  }

  const validatedData = parsed.data;

  const normalizedPayload = {
    ...validatedData,
    startAt: combineDateAndTime(validatedData.startDate, validatedData.startTime),
    endAt: combineDateAndTime(validatedData.endDate, validatedData.endTime),

    selectedTriggerProducts: validatedData.selectedTriggerProducts,
    selectedTriggerCollections: validatedData.selectedTriggerCollections,
    selectedRewardProducts: validatedData.selectedRewardProducts,
  };

  const offerId = payloadData.offerId ?? null;

  try {
    if (offerId) {
      const offer = await updateOffer(offerId, normalizedPayload, merchant.id);
      return data(
        {
          success: true,
          mode: "updated",
          offer,
          id: offer.id,
        },
        {status: 200}
      );
    }

    const offer = await createOffer(normalizedPayload, merchant.id);
    return data(
      { success: true, mode: "created", offer, id: offer.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving offer:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return data(
        { success: false, error: "Database error occurred", code: error.code },
        { status: 500 }
      );
    }

    return data(
      { success: false, error: "Failed to save offer" },
      { status: 500 }
    );
  }
};


export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <OfferForm shop={data.shop}/>
    </>
  )
}
