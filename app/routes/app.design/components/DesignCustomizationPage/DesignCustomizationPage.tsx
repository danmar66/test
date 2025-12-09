import {CustomizeRewardPickerModal} from "../CustomizeRewardPickerModal/CustomizeRewardPickerModal";
import {CustomizeTodaysOffersModal} from "../CustomizeTodaysOffersModal/CustomizeTodaysOffersModal";
import "../../style.css";

interface ICustomizeRewardPickerModal {
  merchantId: number;
  offers_design: JSON;
  picker_design: JSON;
}

export default function DesignCustomizationPage(initialDesign: ICustomizeRewardPickerModal) {
  return (
    <>
      <s-page heading="Design customization">
        <s-link slot="breadcrumb-actions" href="/app">Dashboard</s-link>

        <s-box padding="base none">
          <s-grid gap="base">
            <s-grid gap="small-200">

              {/* Add-to-cart notification */}
              {/*
                <s-box borderRadius="base" border="base" background="base" padding="base">
                  <s-grid gap="small-200">
                    <s-grid
                      gridTemplateColumns="1fr auto"
                      gap="small-300"
                      alignItems="center"
                    >
                      <s-box>
                        <s-heading>Add-to-cart notification</s-heading>
                        <s-text color="subdued">
                          Show a notification when the gift is added to the cart
                        </s-text>
                      </s-box>
                      <s-stack direction="inline" gap="small-200">
                        <s-button icon="edit" variant="secondary">Edit</s-button>
                        <s-button icon="delete" variant="secondary" tone="critical">Delete</s-button>
                      </s-stack>
                    </s-grid>
                  </s-grid>
                </s-box>
              */}

              {/* Product page widget */}
              <s-box borderRadius="base" border="base" background="base" padding="base">
                <s-grid gap="small-200">
                  <s-grid
                    gridTemplateColumns="1fr auto"
                    gap="small-300"
                    alignItems="center"
                  >
                    <s-box>
                      <s-heading>Product page widget</s-heading>
                      <s-text color="subdued">
                        Show a widget on the product page and promote your offers
                      </s-text>
                    </s-box>
                    <s-stack direction="inline" gap="small">
                      <s-button
                        icon="edit"
                        variant="tertiary"
                        onClick={() => shopify.modal.show('todays-offers-popup')}
                      >
                        Edit
                      </s-button>
                    </s-stack>
                  </s-grid>
                </s-grid>
              </s-box>

              {/* Reward picker popup */}
              <s-box borderRadius="base" border="base" background="base" padding="base">
                <s-grid gap="small-200">
                  <s-grid
                    gridTemplateColumns="1fr auto"
                    gap="small-300"
                    alignItems="center"
                  >
                    <s-box>
                      <s-heading>Reward picker popup</s-heading>
                      <s-text color="subdued">
                        Show a customizable popup to the customer to choose a gift
                      </s-text>
                    </s-box>
                    <s-stack direction="inline" gap="small">
                      <s-button
                        icon="edit"
                        variant="tertiary"
                        onClick={() => shopify.modal.show('reward-picker-popup')}
                      >
                        Edit
                      </s-button>
                    </s-stack>
                  </s-grid>
                </s-grid>
              </s-box>

            </s-grid>
          </s-grid>
        </s-box>

        <CustomizeRewardPickerModal initialDesign={initialDesign.picker_design}/>
        <CustomizeTodaysOffersModal initialDesign={initialDesign.offers_design}/>
      </s-page>
    </>
  );
}
