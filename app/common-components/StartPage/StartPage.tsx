import createOffersImage from "../../assets/create-offers.png"
import {useNavigate} from "react-router";
import {Button, Card, EmptyState, Layout, Page} from "@shopify/polaris";
import {TitleBar} from "@shopify/app-bridge-react";

interface StartPageProps {
  shop: string;
}

export default function StartPage({ shop }: StartPageProps) {
  const navigate = useNavigate();

  return (
    <Page
      title={"Dashboard"}
      primaryAction={<Button variant="primary" onClick={() => navigate(`/app/offers/new`)}>Create offer</Button>}
    >
      <TitleBar title="Gift App"></TitleBar>
      <Layout>
        <Layout.Section>
          <Card padding="1000">
            <EmptyState
              heading="No offers yet"
              action={{
                content: "Create offer",
                onAction: () => navigate(`/app/offers/new`),
              }}
              image={createOffersImage}
            >
              <p>Create your first gift offer to boost sales and delight customers</p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
