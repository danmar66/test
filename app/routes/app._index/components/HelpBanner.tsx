import {BlockStack, Box, Button, ButtonGroup, Card, InlineStack, Page, Text} from "@shopify/polaris";

export default function HelpBanner() {
  return (
    <Page>
      <Card padding="400">
        <InlineStack align="space-between" blockAlign="center">
            <Box maxWidth="480px">
              <BlockStack gap={"200"}>
                <Text as="h2" variant="headingSm">
                  Need help?
                </Text>
                <Text as="p" tone="subdued">
                  Reach out to get help with your question via live chat or email
                </Text>
                <ButtonGroup>
                  {/*<Button variant={"primary"}>Start live chat</Button>*/}
                  <Button variant="secondary" external url={"mailto:support@example.com"}>Write an email</Button>
                </ButtonGroup>
              </BlockStack>
            </Box>

            <img
              src="https://placehold.co/64x64?text=Support"
              alt="Support"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
        </InlineStack>
      </Card>
    </Page>
  );
}
