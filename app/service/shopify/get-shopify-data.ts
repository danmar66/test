import { type AdminContext } from "@shopify/shopify-app-react-router/server";
import { logger } from "../logger.server";

export const getShopifyShopData = async (graphql: AdminContext["admin"]["graphql"]) => {
    const response = await graphql(`
        #graphql
        query GetShopifyShopData {
            shop {
                id
                email
                plan {
                    shopifyPlus
                }
                billingAddress {
                    address1
                    address2
                    city
                    province
                    country
                    phone
                }
                shopOwnerName
                myshopifyDomain
                contactEmail
                primaryDomain {
                    url
                }
                currencyCode
                currencyFormats {
                    moneyFormat
                    moneyInEmailsFormat
                }
                weightUnit
            }
        }
    `);

    const body = await response.json();
    if (!body.data?.shop) {
        logger.error("Could not fetch ShopifyShopData", { body });
        throw new Error("Could not fetch ShopifyShopData");
    }

    return body.data;
};
