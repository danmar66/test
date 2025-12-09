import {
  ActionFunctionArgs, data,
  HeadersFunction,
  LoaderFunctionArgs, redirect, useLoaderData,
} from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import StartPage from "../../common-components/StartPage/StartPage";
import {requireMerchantFromAdmin} from "../../service/require-merchant-from-admin";
import {getAppEmbed} from "../../service/shopify/get-app-embed";
import ThemeExtensionBanner from "../../common-components/ThemeExtensionBanner/ThemeExtensionBanner";
import HelpBanner from "./components/HelpBanner";
import {getMerchantOffers} from "../../repository/offer/get-merchant-offers";
import OffersTable from "../../common-components/OffersTable/OffersTable";
import {Prisma} from "@prisma/client";
import {updateOfferStatus} from "../../repository/offer/update-offer-status";
import {deleteOffer} from "../../repository/offer/delete-offer";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const {
    merchant,
    context: { session },
  } = await requireMerchantFromAdmin(request);

  if (!merchant) {
    throw redirect("/auth/login");
  }
  const apiKey = process.env.SHOPIFY_API_KEY;

  const { isAppEnabled, mainThemeId } = await getAppEmbed(session as { shop: string; accessToken: string }, merchant.themeExtensionActivated);

  const { searchParams: rawSearchParams } = new URL(request.url);
  const searchParams = Object.fromEntries(rawSearchParams);

  const offers = await getMerchantOffers(merchant.id);

  const defaultTab = offers.length ? "offers" : "start-page";
  const currentTab = searchParams.tab ?? defaultTab;

  return data({
    ok: true,
    apiKey,
    currentTab,
    offers,
    shop: merchant.shop,
    themeExtensionActivated: isAppEnabled,
    themeId: mainThemeId,
    infoBannerHide: merchant.infoBannerHide,
  });
};


export const action = async ({ request }: ActionFunctionArgs) => {
  let payloadData;
  try {
    payloadData = await request.json();
  } catch (error) {
    return data({error: "Invalid JSON payload"}, {status: 400});
  }

  const {merchant} = await requireMerchantFromAdmin(request);
  if (!merchant) throw redirect("/auth/login");

  const { actionType, offerId } = payloadData;

  try {
    if (actionType === "active" || actionType === "draft") {
      const offer = await updateOfferStatus(offerId, actionType, merchant.id);
      return data(
        {
          success: true,
          mode: "status_updated",
          offerName: offer.offerName,
          offerStatus: offer.status,
          id: offer.id,
        },
        {status: 200}
      );
    }

    if (actionType === "delete") {
      const offer = await deleteOffer(offerId, merchant.id);
      return data(
        {
          success: true,
          mode: "deleted",
          offerName: offer.offerName,
          offerStatus: offer.status,
          id: offer.id,
        },
        {status: 200}
      );
    }

  } catch (error) {
    console.error("Error change offer:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return data(
        {
          success: false,
          error: "Database error occurred",
          code: error.code,
        },
        {status: 500}
      );
    }

    return data(
      {success: false, error: "Failed to change offer"},
      {status: 500}
    );
  }

};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const currentTab = data.currentTab;

  return (
    <>
      <ThemeExtensionBanner shop={data.shop} themeExtensionActivated={data.themeExtensionActivated} infoBannerHide={data.infoBannerHide} apiKey={data.apiKey!} />
      {currentTab === "start-page" && <StartPage shop={data.shop} />}
      {currentTab === "offers" && (
        <OffersTable offersList={data.offers} shop={data.shop} themeId={data.themeId!} />
      )}
      <HelpBanner/>
    </>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
