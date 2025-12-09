import {useFetcher, useNavigate} from "react-router";
import {Button, Layout, Page} from "@shopify/polaris";
import {TitleBar} from "@shopify/app-bridge-react";
import {MerchantOffersData} from "../../repository/offer/get-merchant-offers";
import {useEffect} from "react";

interface OffersTableProps {
  offersList: MerchantOffersData
  shop: string;
  themeId: string;
}

export default function OffersTable({ offersList, shop, themeId }: OffersTableProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const sendAction = (actionType: "draft" | "active" | "delete", offerId: string) => {
    const payload = { actionType, offerId };
    try {
      fetcher.submit(payload, { method: "POST", encType: "application/json" });
    } catch {
      shopify.toast.show("Error saving changes");
    }
  };

  const rowMarkup = offersList.map((offer) => {
    const date = offer.createdAt ? new Date(offer.createdAt) : null

    const formattedDate = date
      ? new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date)
      : "Continuously"

    return (
      <s-table-row key={offer.id}>
        <s-table-cell>
          <s-text>{offer.offerName}</s-text>
        </s-table-cell>
        <s-table-cell>{formattedDate}</s-table-cell>
        <s-table-cell>
          {offer.status === "active" && (
            <s-badge color="base" tone="success">
              Active
            </s-badge>
          )}
          {offer.status === "draft" && (
            <s-badge color="base" tone="neutral">
              Draft
            </s-badge>
          )}
        </s-table-cell>
        <s-table-cell>
          <s-switch disabled={isLoading} checked={offer.status === "active"} onChange={(e) => sendAction(e.currentTarget.checked ? "active" : "draft", offer.id)}/>
        </s-table-cell>
        <s-table-cell>
          <s-stack gap="small" direction={"inline"}>
            <s-button variant={"secondary"} icon={"edit"} onClick={() => navigate(`offers/${offer.id}`)}/>
            <s-button variant={"secondary"} icon={"delete"} tone={"critical"} onClick={() => sendAction('delete', offer.id)}/>
          </s-stack>
        </s-table-cell>
      </s-table-row>
    )
  })

  useEffect(() => {
    if (!fetcher.data) return;

    if ("success" in fetcher.data && fetcher.data.success) {
      if (fetcher.data.mode === "status_updated") {
        shopify.toast.show(`Status of offer ${fetcher.data.offerName} has been changed to ${fetcher.data.offerStatus}`);
      }
      if (fetcher.data.mode === "deleted") {
        shopify.toast.show(`Offer ${fetcher.data.offerName} has been deleted`);
      }
    }
  }, [fetcher.data]);

  return (
    <Page
      title={"Dashboard"}
      primaryAction={<Button variant="primary" onClick={() => navigate(`/app/offers/new`)}>Create offer</Button>}
    >
      <TitleBar title="Gift App"></TitleBar>
      <Layout>
        <Layout.Section>
          <s-section padding={"none"}>
            <div style={{padding: "var(--p-space-200)"}}>
              <span style={{fontSize: "large", fontWeight: 700}}>Gift offers</span>
            </div>
            <s-section
              padding="none"
              accessibilityLabel="Offers table section"
            >
              <s-table>
                <s-grid slot="filters" gap="small-200" gridTemplateColumns="1fr auto">
                  <s-text-field
                    label="Search puzzles"
                    labelAccessibilityVisibility="exclusive"
                    icon="search"
                    placeholder="Search"
                  />
                </s-grid>
                <s-table-header-row>
                  <s-table-header>Campaign</s-table-header>
                  <s-table-header listSlot="inline">Created at</s-table-header>
                  <s-table-header listSlot="inline">Status</s-table-header>
                  <s-table-header listSlot="kicker">On/Off</s-table-header>
                  <s-table-header listSlot="secondary">Actions</s-table-header>
                </s-table-header-row>
                <s-table-body>
                  {rowMarkup}
                </s-table-body>
              </s-table>
            </s-section>
          </s-section>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
