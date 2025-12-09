import {type ActionFunctionArgs, data, type LoaderFunctionArgs} from "react-router";
import { useLoaderData } from "react-router";
import DesignCustomizationPage from "./components/DesignCustomizationPage/DesignCustomizationPage";
import {requireMerchantFromAdmin} from "../../service/require-merchant-from-admin";
import prisma from "../../db.server";
import {updateMetafields} from "../../service/offer/update-metafields";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { merchant } = await requireMerchantFromAdmin(request);

  if (!merchant) throw new Response("Merchant unauthorized", { status: 401 });

  const design = await prisma.design.findUnique({
    where: { merchantId: merchant.id }
  });

  return data({
    design
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    merchant,
    context: {
      admin: { graphql },
    },
  } = await requireMerchantFromAdmin(request);
  if (!merchant) throw new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const { intent, payload } = body;

  const { design } = JSON.parse(payload);

  let updated;

  if (intent === "save_reward_design") {
    updated = await prisma.design.upsert({
      where: { merchantId: merchant.id },
      create: {
        merchantId: merchant.id,
        picker_design: design,
      },
      update: {
        picker_design: design,
      },
    });

    await updateMetafields({
      graphql,
      shopId: merchant.shopId,
      action: "picker_design",
      design,
    }).catch((err) => {
      console.log(err);
    });
  }

  if (intent === "save_offers_design") {
    // Оновлюємо offers_design
    updated = await prisma.design.upsert({
      where: { merchantId: merchant.id },
      create: {
        merchantId: merchant.id,
        offers_design: design,
      },
      update: {
        offers_design: design,
      },
    });

    await updateMetafields({
      graphql,
      shopId: merchant.shopId,
      action: "offers_design",
      design,
    });
  }

  return data({ success: true, updated });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <DesignCustomizationPage
      initialDesign={loaderData}
    />
  );
}
