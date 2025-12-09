import {Modal, TitleBar} from '@shopify/app-bridge-react';
import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Collapsible,
  Grid,
  RangeSlider,
  Text,
  TextField,
} from '@shopify/polaris';
import {useCallback, useState} from 'react';
import {ChevronDownIcon, ChevronUpIcon, DesktopIcon, MobileIcon} from "@shopify/polaris-icons";
import {DesignSettings} from "../../types";
import {useFetcher} from "react-router";
import MobileTodaysOffersPreview from "../MobileTodaysOffersModal/MobileTodaysOffersPreview";
import DesktopTodaysOffersPreview from "../DesktopTodaysOffersModal/DesktopTodaysOffersPreview";
import "../../style.css"

export function CustomizeTodaysOffersModal({initialDesign}: {initialDesign: DesignSettings | null }) {
  const fetcher = useFetcher();
  const defaultDesign: DesignSettings = {
    title: "Today’s offers",
    subtitle: "Claim your gifts",
    button: "Get offer",

    headerColors: {
      title: "#1C1C1C",
      subtitle: "#1C1C1C",
      background: "#F7F7F7",
    },

    bodyColors: {
      background: "#FFFFFF",
      border: "#DADADA",
      buttonBg: "#1C1C1C",
      buttonText: "#FFFFFF",
    },

    radius: {
      atc: 12,
      popup: 18,
      productCard: 10,
    }
  };

  const [design, setDesign] = useState(initialDesign || defaultDesign);

  // Selected preview mode
  const [activeTypePreviewIndex, setActiveTypePreviewIndex] = useState(0);

  const handleTypePreviewClick = useCallback(
    (index: number) => {
      if (activeTypePreviewIndex !== index) {
        setActiveTypePreviewIndex(index);
      }
    },
    [activeTypePreviewIndex]
  );

  // Update top-level field (title, subtitle, button, allowMultiple, etc.)
  const update = (key: string, val: any) => {
    setDesign(prev => ({ ...prev, [key]: val }));
  };

  // Update nested object (headerColors, bodyColors, radius, etc.)
  const updateNested = (group: keyof typeof design, key: string, val: any) => {
    setDesign(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: val,
      },
    }));
  };

  // Collapsible states
  const [openGeneral, setOpenGeneral] = useState(true);
  const [openCustomize, setOpenCustomize] = useState(true);

  const toggleGeneral = () => setOpenGeneral(o => !o);
  const toggleCustomize = () => setOpenCustomize(o => !o);

  const handleSave = () => {
    fetcher.submit(
      {
        intent: "save_offers_design",
        payload: JSON.stringify({ design })
      },
      {
        method: "post",
        encType: "application/json"
      }
    );

    shopify.toast.show("Design saved");
    shopify.modal.hide("todays-offers-popup");
  }

  return (
    <>
      <Modal id="todays-offers-popup" variant="max">
        <s-box inlineSize="100%">
          <s-grid
            gridTemplateColumns="minmax(0, 1fr) minmax(0, 2fr)"
            gap="none"
            inlineSize="100%"
          >

            {/* LEFT — SETTINGS */}
            <s-grid-item gridColumn="auto">
              <Box padding="300">
                <BlockStack gap="300">

                  {/* GENERAL ACCORDION */}
                  <Card>
                    <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                      <Text as="h2" variant="headingMd">General</Text>
                      <Button
                        variant="tertiary"
                        onClick={toggleGeneral}
                        ariaExpanded={openGeneral}
                        ariaControls="general-collapsible"
                        icon={openGeneral ? ChevronUpIcon : ChevronDownIcon}
                      >
                        {openGeneral ? "Show less" : "Show more"}
                      </Button>
                    </s-stack>

                    <Collapsible
                      open={openGeneral}
                      id="general-collapsible"
                      transition={{duration: "350ms", timingFunction: "ease"}}
                    >
                      <Box paddingBlockStart="400">
                        <TextField
                          label="Title"
                          value={design.title}
                          onChange={(v) => update("title", v)}
                          autoComplete={"off"}
                        />

                        <Box paddingBlockStart="200">
                          <TextField
                            label="Subtitle"
                            value={design.subtitle}
                            onChange={(v) => update("subtitle", v)}
                            autoComplete={"off"}
                          />
                        </Box>

                        <Box paddingBlockStart="200">
                          <TextField
                            label="Primary button"
                            value={design.button}
                            onChange={(v) => update("button", v)}
                            autoComplete={"off"}
                          />
                        </Box>

                      </Box>
                    </Collapsible>
                  </Card>

                  {/* CUSTOMIZE ACCORDION */}
                  <Card>
                    <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                      <Text as="h2" variant="headingMd">Customize</Text>
                      <Button
                        variant="tertiary"
                        onClick={toggleCustomize}
                        ariaExpanded={openCustomize}
                        ariaControls="customize-collapsible"
                        icon={openCustomize ? ChevronUpIcon : ChevronDownIcon}
                      >
                        {openCustomize ? "Show less" : "Show more"}
                      </Button>
                    </s-stack>

                    <Collapsible
                      open={openCustomize}
                      id="customize-collapsible"
                      transition={{duration: "350ms", timingFunction: "ease"}}
                    >
                      <Box paddingBlockStart="300">
                        <Text as="h3" variant="headingSm">Header colors</Text>

                        <s-box paddingBlockStart="small">
                          <Grid columns={{xs: 1, lg: 2}}>
                            <Grid.Cell>
                              <s-stack>
                                <s-color-field
                                  label="Title"
                                  value={design.headerColors.title}
                                  onChange={(v) => updateNested("headerColors", "title", v.currentTarget.value)}
                                />
                              </s-stack>
                            </Grid.Cell>

                            <Grid.Cell>
                              <s-stack>
                                <s-color-field
                                  label="Subtitle"
                                  value={design.headerColors.subtitle}
                                  onChange={(v) => updateNested("headerColors", "subtitle", v.currentTarget.value)}
                                />
                              </s-stack>
                            </Grid.Cell>

                            <Grid.Cell>
                              <s-stack>
                                <s-color-field
                                  label="Background"
                                  value={design.headerColors.background}
                                  onChange={(v) =>
                                    updateNested("headerColors", "background", v.currentTarget.value)
                                  }
                                />
                              </s-stack>
                            </Grid.Cell>
                          </Grid>
                        </s-box>

                        <Box paddingBlockStart="300">
                          <Text as="h3" variant="headingSm">Body colors</Text>

                          <s-box paddingBlockStart="small">
                            <Grid columns={{xs: 1, lg: 2}}>
                              <Grid.Cell>
                                <s-stack>
                                  <s-color-field
                                    label="Background"
                                    value={design.bodyColors.background}
                                    onChange={(v) =>
                                      updateNested("bodyColors", "background", v.currentTarget.value)
                                    }
                                  />
                                </s-stack>
                              </Grid.Cell>

                              <Grid.Cell>
                                <s-stack>
                                  <s-color-field
                                    label="Border"
                                    value={design.bodyColors.border}
                                    onChange={(v) =>
                                      updateNested("bodyColors", "border", v.currentTarget.value)
                                    }
                                  />
                                </s-stack>
                              </Grid.Cell>

                              <Grid.Cell>
                                <s-stack>
                                  <s-color-field
                                    label="Button background"
                                    value={design.bodyColors.buttonBg}
                                    onChange={(v) =>
                                      updateNested("bodyColors", "buttonBg", v.currentTarget.value)
                                    }
                                  />
                                </s-stack>
                              </Grid.Cell>

                              <Grid.Cell>
                                <s-stack>
                                  <s-color-field
                                    label="Button text"
                                    value={design.bodyColors.buttonText}
                                    onChange={(v) =>
                                      updateNested("bodyColors", "buttonText", v.currentTarget.value)
                                    }
                                  />
                                </s-stack>
                              </Grid.Cell>
                            </Grid>
                          </s-box>
                        </Box>

                        <Box paddingBlockStart="500">
                          <Text as="h3" variant="headingSm">Corner radius</Text>
                        </Box>

                        <Box paddingBlockStart="300">
                          <RangeSlider
                            label={"ATC button radius"}
                            output
                            min={0}
                            max={32}
                            step={4}
                            value={design.radius.atc}
                            onChange={(v) => updateNested("radius", "atc", v)}
                          />
                        </Box>

                        <Box paddingBlockStart="300">
                          <RangeSlider
                            label={"Popup radius"}
                            output
                            min={0}
                            max={32}
                            step={4}
                            value={design.radius.popup}
                            onChange={(v) => updateNested("radius", "popup", v)}
                          />
                        </Box>

                        <Box paddingBlockStart="300">
                          <RangeSlider
                            label={"Product card radius"}
                            output
                            min={0}
                            max={32}
                            step={4}
                            value={design.radius.productCard}
                            onChange={(v) => updateNested("radius", "productCard", v)}
                          />
                        </Box>
                      </Box>
                    </Collapsible>
                  </Card>

                </BlockStack>
              </Box>
            </s-grid-item>

            <s-grid-item gridColumn="auto">
              <s-box background="subdued" padding="base">
                <s-stack direction="inline" justifyContent="end">
                  <ButtonGroup variant="segmented">
                    <Button
                      pressed={activeTypePreviewIndex === 0}
                      onClick={() => handleTypePreviewClick(0)}
                      icon={MobileIcon}
                    >
                      Mobile
                    </Button>
                    <Button
                      pressed={activeTypePreviewIndex === 1}
                      onClick={() => handleTypePreviewClick(1)}
                      icon={DesktopIcon}
                    >
                      Desktop
                    </Button>
                  </ButtonGroup>
                </s-stack>
              </s-box>

              {/* preview container */}
              <s-box background="subdued" padding="large" blockSize="100%">
                <s-stack alignItems={"center"} justifyContent="center">
                  {activeTypePreviewIndex === 0 && (
                    <MobileTodaysOffersPreview settings={design}/>
                  )}
                  {activeTypePreviewIndex === 1 && (
                    <DesktopTodaysOffersPreview settings={design}/>
                  )}
                </s-stack>
              </s-box>

            </s-grid-item>

          </s-grid>
        </s-box>

        <TitleBar title="Today's offers">
          <button
            variant="primary"
            onClick={handleSave}
          >
            Save
          </button>

        </TitleBar>
      </Modal>
    </>
  );
}
