import {AdminContext} from "@shopify/shopify-app-react-router/server";
import { logger } from "app/service/logger.server";

export const deleteShopMetafield = async (graphql: AdminContext["admin"]["graphql"], shopId: string, key: string) => {
    try {
        const deleteResponse = await graphql(
            `
                #graphql
                mutation MetafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {
                    metafieldsDelete(metafields: $metafields) {
                        deletedMetafields {
                            ownerId
                            namespace
                            key
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `,
            {
                variables: {
                    metafields: [
                        {
                            ownerId: shopId,
                            namespace: "walnut",
                            key,
                        },
                    ],
                },
            },
        );

        const deleteData = await deleteResponse.json();
        const errors = deleteData?.data?.metafieldsDelete?.userErrors;

        if (errors?.length) {
            logger.error("Shopify Metafield Delete Error:", { errors });
            throw new Error(errors.map((e: any) => e.message).join(", "));
        }

        return deleteData?.data?.metafieldsDelete?.deletedMetafields![0]?.key;
    } catch (error) {
        logger.error("Shopify Metafield Delete Error:", { error });
        throw new Response(JSON.stringify({ error: error }), { status: 500 });
    }
};
