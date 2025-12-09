import {useEffect, useRef, useState} from "react";
import {useFetcher, useLoaderData, useNavigate, useParams} from "react-router";
import ProductList from "../ProductsList/ProductsList"
import CollectionsList from "../CollectionsList/CollectionsList";
import {parseValidationErrors} from "../../../../utils/parseValidationErrors";
import {
  DiscountType,
  OfferActionResponse,
  OfferFormState,
  Product,
  Collection,
  RewardActionType,
  ScheduleType,
  TriggerConditionText,
  TriggerConditionType,
  TriggerType
} from "../../types";
import styles from "./styles.module.css";
import {loader} from "../../route";
import {safeParseArray} from "../../../../utils/safeParseArray";

interface OfferFormProps {
  shop: string;
}

export default function OfferForm({shop}: OfferFormProps) {
  const fetcher = useFetcher<OfferActionResponse>();
  const navigate = useNavigate();
  const { offer } = useLoaderData<typeof loader>();

  const selectedTriggerProductsData = safeParseArray<Product>(offer?.selectedTriggerProducts);
  const selectedTriggerCollectionsData = safeParseArray<Collection>(offer?.selectedTriggerCollections);
  const selectedRewardProductsData = safeParseArray<Product>(offer?.selectedRewardProducts);

  const { offerId } = useParams();
  const isEdit = offerId && offerId !== "new";

  const rawErrors = fetcher.data?.errors || {};
  const fieldErrors = Array.isArray(rawErrors) ? parseValidationErrors(rawErrors) : {};

  const hasChangesRef = useRef(false);
  const saveBarShownRef = useRef(false);
  const initialStateRef = useRef<string>("");
  const isDiscardingRef = useRef(false); // Додаємо флаг для відслідковування discard

  const [form, setForm] = useState<OfferFormState>(() => {
    if (offer) {
      return {
        offerName: offer.offerName,
        triggerType: offer.triggerType as TriggerType,
        triggerCondition: offer.triggerCondition as TriggerConditionType,
        minQuantity: offer.minQuantity ?? 1,
        maxQuantity: offer.maxQuantity ?? undefined,
        minAmount: offer.minAmount ?? undefined,
        maxAmount: offer.maxAmount ?? undefined,
        rewardAction: offer.rewardAction as RewardActionType,
        rewardGiftsAmount: offer.rewardGiftsAmount ?? undefined,
        discountType: offer.discountType as DiscountType,
        discountValue: offer.discountValue,
        scheduleType: offer.scheduleType as ScheduleType,
        hasEndDate: offer.hasEndDate,
        startDate: offer.startDate ? new Date(offer.startDate).toISOString().slice(0, 10) : undefined,
        startTime: offer.startTime ?? undefined,
        endDate: offer.endDate ? new Date(offer.endDate).toISOString().slice(0, 10) : undefined,
        endTime: offer.endTime ?? undefined,
      }
    }

    return {
      offerName: "",
      triggerType: TriggerType.Products,
      triggerCondition: TriggerConditionType.AnyProducts,
      minQuantity: 1,
      maxQuantity: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      rewardAction: RewardActionType.Auto,
      rewardGiftsAmount: undefined,
      discountType: DiscountType.Percentage,
      discountValue: 100,
      scheduleType: ScheduleType.Continuously,
      hasEndDate: false,
      startDate: undefined,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
    }
  });

  const [selectedTriggerProducts, setSelectedTriggerProducts] = useState<Product[]>(selectedTriggerProductsData);
  const [selectedTriggerCollections, setSelectedTriggerCollections] = useState<Collection[]>(selectedTriggerCollectionsData);
  const [selectedRewardProducts, setSelectedRewardProducts] = useState<Product[]>(selectedRewardProductsData);

  useEffect(() => {
    initialStateRef.current = JSON.stringify({
      form,
      selectedTriggerProducts,
      selectedTriggerCollections,
      selectedRewardProducts
    });
  }, []);

  const showSaveBar = () => {
    if (!saveBarShownRef.current) {
      saveBarShownRef.current = true;
      shopify.saveBar.show("my-save-bar");
    }
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      ...(isEdit && offerId ? { offerId } : {}),
      status: isEdit ? offer!.status : "active",
      selectedTriggerProducts: JSON.stringify(selectedTriggerProducts),
      selectedTriggerCollections: JSON.stringify(selectedTriggerCollections),
      selectedRewardProducts: JSON.stringify(selectedRewardProducts),
      shop,
    };

    try {
      fetcher.submit(payload, {method: "post", encType: "application/json"});
    } catch {
      shopify.toast.show("Error saving offer");
    }
  };

  const handleDiscard = () => {
    isDiscardingRef.current = true;

    const initialState = JSON.parse(initialStateRef.current);
    setForm(initialState.form);
    setSelectedTriggerProducts(initialState.selectedTriggerProducts);
    setSelectedTriggerCollections(initialState.selectedTriggerCollections);
    setSelectedRewardProducts(initialState.selectedRewardProducts);

    hasChangesRef.current = false;
    saveBarShownRef.current = false;
    shopify.saveBar.hide("my-save-bar");

    setTimeout(() => {
      isDiscardingRef.current = false;
    }, 100);
  };

  useEffect(() => {
    if (isDiscardingRef.current) {
      return;
    }

    const currentState = JSON.stringify({
      form,
      selectedTriggerProducts,
      selectedTriggerCollections,
      selectedRewardProducts
    });

    if (initialStateRef.current && currentState !== initialStateRef.current) {
      if (!hasChangesRef.current) {
        hasChangesRef.current = true;
        showSaveBar();
      }
    }
  }, [form, selectedTriggerProducts, selectedTriggerCollections, selectedRewardProducts]);

  const handleChange = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({...prev, [key]: value}));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  const handleSelectProducts = async (type: "reward" | "trigger") => {
    try {
      const currentSelected =
        type === "reward" ? selectedRewardProducts : selectedTriggerProducts;

      const selectedIds = currentSelected.map((product) => ({
        id: product.id,
        variants: product.variants
          .filter((variant) => Boolean(variant.id))
          .map((variant) => ({ id: variant.id })),
      }));

      const payload = await shopify.resourcePicker({
        type: "product",
        multiple: true,
        action: "add",
        filter: { variants: true, draft: false, archived: false },
        selectionIds: selectedIds,
      });

      if (!payload) return;

      const selected: Product[] = payload.map((product) => ({
        id: String(product.id),
        title: product.title ?? "",
        images: (product.images ?? []).map((img) => ({
          id: img.id ?? "",
          altText: img.altText ?? "",
          originalSrc: img.originalSrc ?? "",
        })),
        totalVariants: product.totalVariants ?? 0,
        variants: (product.variants ?? []).map((variant) => ({
          id: String(variant.id ?? ""),
          title: variant.title ?? "",
          price: variant.price ?? "0",
          image: {
            id: variant.image?.id ?? "",
            altText: variant.image?.altText ?? "",
            originalSrc: variant.image?.originalSrc ?? "",
          },
        })),
      }));

      if (type === "reward") {
        setSelectedRewardProducts(selected);
      } else {
        setSelectedTriggerProducts(selected);
      }
    } catch (err) {
      console.error(`Error opening ${type} Resource Picker:`, err);
    }
  };

  const handleSelectTriggerCollections = async () => {
    try {
      const selectedIds = selectedTriggerCollections.map((collection) => ({
        id: collection.id,
      }))

      const payload = await shopify.resourcePicker({
        type: "collection",
        multiple: true,
        action: "add",
        filter: {variants: false, draft: false, archived: false},
        selectionIds: selectedIds
      });

      if (!payload) return;

      const selected: Collection[] = payload.map(collection => ({
        id: collection.id,
        title: collection.title,
        image: {
          id: collection.image?.id ?? "",
          altText: collection.image?.altText ?? "",
          originalSrc: collection.image?.originalSrc ?? "",
        }
      }))

      setSelectedTriggerCollections(selected);
    } catch (err) {
      console.error("Error opening Resource Picker:", err);
    }
  }

  const handleRemoveProduct = (
    type: "trigger" | "reward",
    productId: string,
    variantId?: string
  ) => {
    const updateList = (prev: Product[]) =>
      prev
        .map((product) => {
          if (product.id !== productId) return product;

          if (!variantId) return null;

          const filteredVariants = (product.variants || []).filter(
            (variant) => variant.id !== variantId
          );

          if (filteredVariants.length === 0) return null;

          return { ...product, variants: filteredVariants };
        })
        .filter((p): p is Product => p !== null);

    if (type === "reward") {
      setSelectedRewardProducts(updateList);
    } else {
      setSelectedTriggerProducts(updateList);
    }
  };

  const handleRemoveCollection = (collectionId: string) => {
    setSelectedTriggerCollections((prev) =>
      prev.filter((collection) => collection.id !== collectionId)
    );
  };

  useEffect(() => {
    if (fetcher.data?.success) {
      if (fetcher.data?.mode === "created") shopify.toast.show("Offer successfully created");
      if (fetcher.data?.mode === "updated") shopify.toast.show("Offer successfully updated");

      initialStateRef.current = JSON.stringify({
        form,
        selectedTriggerProducts,
        selectedTriggerCollections,
        selectedRewardProducts
      });

      hasChangesRef.current = false;
      saveBarShownRef.current = false;
      shopify.saveBar.hide("my-save-bar");

      if (!isEdit && fetcher.data?.id) {
        navigate(`/app/offers/${fetcher.data.id}`);
      }
    }
  }, [fetcher.data, isEdit, navigate]);

  return (
    <form
      id="offerForm"
    >
      <ui-save-bar id="my-save-bar">
        <button variant="primary" id="save-button" onClick={handleSave}></button>
        <button id="discard-button" onClick={handleDiscard}></button>
      </ui-save-bar>
      <s-page heading={isEdit ? "Edit offer" : "Create new offer"}>
        <s-link slot="breadcrumb-actions" href="/app">
          Dashboard
        </s-link>
        <s-button slot="secondary-actions">Duplicate</s-button>
        <s-button slot="secondary-actions">Delete</s-button>

        <s-section heading="Offer name">
          <s-grid gap="base">
            <s-text-field
              label="Customers will not see it"
              name="offerName"
              value={form.offerName}
              placeholder="Buy 1 get 1 the same"
              onChange={(event) => handleChange("offerName", event.currentTarget.value)}
              error={fieldErrors?.offerName}
            />
          </s-grid>
        </s-section>

        <s-section>
          <s-section heading="Offer trigger">
            <s-text>Select an option</s-text>
            <s-grid
              gridTemplateColumns="repeat(2, 1fr)"
              gap="base"
            >
              <s-box border="base" borderRadius="base" overflow="hidden">
                <s-clickable
                  onClick={() => handleChange("triggerType", TriggerType.Products)}
                >
                  <s-grid
                    gridTemplateColumns="24px 1fr"
                    background="base"
                    padding="small"
                    gap="small"
                    alignItems="center"
                    justifyContent={"start"}
                  >
                    <input
                      name="triggerType"
                      type="radio"
                      value="products"
                      checked={form.triggerType === "products"}
                      onChange={() => handleChange("triggerType", TriggerType.Products)}
                    />
                    <s-box>
                      <s-heading>
                        Customer buys products
                      </s-heading>
                      <s-text color={"subdued"}>
                        {`e.g. "buy 2, get 1 free"`}
                      </s-text>
                    </s-box>
                  </s-grid>
                </s-clickable>
              </s-box>

              <s-box border="base" borderRadius="base" overflow="hidden">
                <s-clickable
                  onClick={() => handleChange("triggerType", TriggerType.Amount)}
                >
                  <s-grid
                    gridTemplateColumns="24px 1fr"
                    background="base"
                    padding="small"
                    gap="small"
                    alignItems="center"
                    justifyContent={"start"}
                  >
                    <input
                      name="triggerType"
                      type="radio"
                      id="huey"
                      value="amount"
                      checked={form.triggerType === "amount"}
                      onChange={() => handleChange("triggerType", TriggerType.Amount)}
                    />
                    <s-box>
                      <s-heading>
                        Customer spends amount
                      </s-heading>
                      <s-text color={"subdued"}>
                        {`e.g. "spend $100, get a gift"`}
                      </s-text>
                    </s-box>
                  </s-grid>
                </s-clickable>
              </s-box>
            </s-grid>
          </s-section>

          {form.triggerType === "products" && (
            <s-section heading="How many products must they buy?">
              <s-grid
                gridTemplateColumns="repeat(2, 1fr)"
                gap="base"
              >
                <s-number-field
                  name="minQuantity"
                  label={"Min"}
                  placeholder="0"
                  min={0}
                  step={1}
                  value={String(form.minQuantity)}
                  onChange={(event) => handleChange("minQuantity", parseInt(event.currentTarget.value))}
                  error={fieldErrors?.minQuantity}
                />
                <s-number-field
                  name="maxQuantity"
                  label={"Max (optional)"}
                  step={1}
                  value={String(form.maxQuantity)}
                  onChange={(event) => handleChange("maxQuantity", parseInt(event.currentTarget.value))}
                />
              </s-grid>
            </s-section>
          )}

          {form.triggerType === "amount" && (
            <s-section heading="Minimum amount">
              <s-grid
                gridTemplateColumns="repeat(2, 1fr)"
                gap="base"
              >
                <s-money-field
                  name="minAmount"
                  label={"Min"}
                  placeholder="0"
                  min={1}
                  value={String(form.minAmount)}
                  onChange={(event) => handleChange("minAmount", parseInt(event.currentTarget.value))}
                  error={fieldErrors?.minAmount}
                />
                <s-money-field
                  name="maxAmount"
                  label={"Max (optional)"}
                  value={String(form.maxAmount)}
                  onChange={(event) => handleChange("maxAmount", parseInt(event.currentTarget.value))}
                  error={fieldErrors?.maxAmount}
                />
              </s-grid>
            </s-section>
          )}

          <s-section heading="Which products count?">
            <s-select
              name="triggerCondition"
              onChange={(e) => handleChange("triggerCondition", e.currentTarget.value as TriggerConditionType)}
              error={fieldErrors?.triggerCondition || fieldErrors?.selectedTriggerProducts || fieldErrors?.selectedTriggerCollections}
            >
              <s-option value="anyProducts">Any products</s-option>
              <s-option value="specificProducts">Specific products</s-option>
              <s-option value="collections">Specific collections</s-option>
            </s-select>
            <s-section>
              {form.triggerCondition === "specificProducts" && (
                <>
                  <s-button variant={"primary"} onClick={() => handleSelectProducts("trigger")}>Choose products</s-button>
                  {selectedTriggerProducts.length > 0 && (
                    <ProductList
                      products={selectedTriggerProducts}
                      onRemove={(productId, variantId) =>
                        handleRemoveProduct("trigger", productId, variantId)
                      }
                    />
                  )}
                </>
              )}
              {form.triggerCondition === "collections" && (
                <>
                  <s-button variant={"primary"} onClick={handleSelectTriggerCollections}>Choose collections</s-button>
                  {selectedTriggerCollections.length > 0 && (
                    <CollectionsList
                      collections={selectedTriggerCollections}
                      onRemove={handleRemoveCollection}
                    />
                  )}
                </>
              )}
            </s-section>
          </s-section>
        </s-section>

        <s-section heading="Reward Action">
          <s-choice-list
            name="rewardAction"
            onChange={(e) => handleChange("rewardAction", e.currentTarget.values[0] as RewardActionType)}
            error={fieldErrors?.rewardAction}
          >
            <s-choice value="auto" selected={form.rewardAction === "auto"}>
              Auto-add gift to cart
              <s-text slot="details">Products are added automatically, no customer action needed</s-text>
            </s-choice>
            <s-choice value="manual" selected={form.rewardAction === "manual"}>
              Customer chooses gift
              <s-text slot="details">Let customers choose a gift from a list and select a product variant (color, size,
                etc.)</s-text>
            </s-choice>
          </s-choice-list>
        </s-section>


        <s-section heading="Reward">
          <s-paragraph>Which product(s) to add automatically?</s-paragraph>
          <s-button
            variant={"primary"}
            onClick={() => handleSelectProducts("reward")}
          >
            Choose products
          </s-button>

          {fieldErrors?.selectedRewardProducts && (
            <div className={styles.error} aria-live="polite">
              <span>
                <s-icon type="alert-circle" size="small"></s-icon>
              </span>
              You must specify a reward product(s)
            </div>
          )}

          {form.rewardAction === RewardActionType.Manual && (
            <s-section>
              <s-number-field
                name="rewardGiftsAmount"
                label={"Number of gifts customer will receive"}
                min={1}
                step={1}
                placeholder="1"
                value={String(form.rewardGiftsAmount)}
                onChange={(e) => handleChange("rewardGiftsAmount", Number(e.currentTarget.value))}
                error={fieldErrors?.rewardGiftsAmount}
              />
            </s-section>
          )}
          <s-section heading="Discount">
            <s-grid
              gridTemplateColumns="repeat(2, 1fr)"
              gap="base"
            >
              <s-select
                label="Type"
                name="discountType"
                disabled={form.rewardAction === RewardActionType.Auto}
                onChange={(e) => {
                  handleChange("discountType", e.currentTarget.value as DiscountType);
                  handleChange("discountValue", 100);
                }}
              >
                <s-option value="percentage">Percentage</s-option>
                <s-option value="amount">Amount off each</s-option>
              </s-select>
              {form.discountType === "percentage" && (
                <s-number-field
                  name="discountValue"
                  label={"Value"}
                  placeholder={"100"}
                  value={String(form.discountValue)}
                  max={100}
                  min={1}
                  step={1}
                  prefix={"%"}
                  disabled={form.rewardAction === RewardActionType.Auto}
                  onChange={(e) => handleChange("discountValue", parseInt(e.currentTarget.value))}
                  error={fieldErrors?.discountValue}
                />
              )}
              {form.discountType === "amount" && (
                <s-text-field
                  name="discountValue"
                  label="Amount"
                  prefix={"USD"}
                  placeholder="99.99"
                  value={String(form.discountValue)}
                  onChange={(e) => handleChange("discountValue", parseFloat(e.currentTarget.value))}
                  error={fieldErrors?.discountValue}
                />
              )}
            </s-grid>
            <ProductList
              products={selectedRewardProducts}
              onRemove={(productId, variantId) =>
                handleRemoveProduct("reward", productId, variantId)
              }
            />
          </s-section>
        </s-section>

        <s-section heading="Schedule">
          <s-choice-list
            name="scheduleType"
            onChange={(e) => handleChange("scheduleType", e.currentTarget.values[0] as ScheduleType)}
            error={fieldErrors?.scheduleType}
          >
            <s-choice selected={form.scheduleType === ScheduleType.Continuously} value="continuously">Run this offer continuously</s-choice>
            <s-choice selected={form.scheduleType === ScheduleType.Schedule} value="schedule">Schedule offer</s-choice>
          </s-choice-list>
          {form.scheduleType === "schedule" && (
            <s-stack gap="small-100" padding={"small-200 none none none"}>
              <s-grid
                gridTemplateColumns="repeat(2, 1fr)"
                gap="base"
              >
                <s-date-field
                  label="Start date"
                  name="startDate"
                  id="report-start"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.currentTarget.value)}
                  error={fieldErrors?.startDate}
                />
                <s-text-field
                  label="Start time"
                  icon="clock"
                  name="startTime"
                  value={form.startTime}
                  onChange={(e) => handleChange("startTime", e.currentTarget.value)}
                  error={fieldErrors?.startTime}
                />
              </s-grid>

              {form.hasEndDate && (
                <s-grid
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap="base"
                >
                  <s-date-field
                    label="End date"
                    name="endDate"
                    id="report-end"
                    value={form.endDate}
                    onChange={(e) => handleChange("endDate", e.currentTarget.value)}
                    error={fieldErrors?.endDate}
                  />
                  <s-text-field
                    label="End time"
                    icon="clock"
                    name="endTime"
                    value={form.endTime}
                    onChange={(e) => handleChange("endTime", e.currentTarget.value)}
                    error={fieldErrors?.endTime}
                  />
                </s-grid>
              )}

              <s-checkbox
                label="Set end date"
                name={"hasEndDate"}
                defaultChecked={form.hasEndDate}
                onChange={(e) => handleChange("hasEndDate", e.currentTarget.checked)}
              />
            </s-stack>
          )}
        </s-section>

        <s-box padding="none none base none">
          <s-stack alignItems={"center"}>
            <s-text>Need help? <s-link>Chat with us</s-link></s-text>
          </s-stack>
        </s-box>

        {/* === Sidebar preview === */}
        <s-box slot="aside">
          <s-section>
            <s-box padding={"none none small-200"}>
              <s-heading>Need help creating offers?</s-heading>
              <s-text>Chat with us for assistance</s-text>
            </s-box>
            <s-button>Chat with us</s-button>
          </s-section>

          <s-section heading="Summary">
            <s-grid>
              <s-section heading="Trigger">
                <s-paragraph>
                  {form.triggerType === "products"
                    ? `Customer buys ${form.minQuantity} or more items from ${TriggerConditionText[form.triggerCondition]}`
                    : `Customer spends amount`}
                </s-paragraph>
              </s-section>
              <s-box padding="none none base none">
                <s-divider/>
              </s-box>
              <s-section heading="Rewards">
                <s-stack direction="block">
                  <s-text>
                    {form.discountType === DiscountType.Percentage && `Discount: ${form.discountValue ?? ""}% off`}
                    {form.discountType === DiscountType.Amount && `If customer spends ${form.discountValue ?? ""}`}
                  </s-text>
                  <s-text>
                    {`Customer receives ${selectedRewardProducts.length} gift(s)`}
                  </s-text>
                </s-stack>
              </s-section>
              <s-box padding="none none base none">
                <s-divider/>
              </s-box>
              <s-section heading="Action">
                <s-paragraph>
                  {form.rewardAction === RewardActionType.Auto && `Automatically add product(s) to cart`}
                  {form.rewardAction === RewardActionType.Manual && `Customer chooses gift`}
                </s-paragraph>
              </s-section>
            </s-grid>
          </s-section>
        </s-box>
      </s-page>
    </form>
  );
}
