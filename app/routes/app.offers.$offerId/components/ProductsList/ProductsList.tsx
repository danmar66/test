import {useState} from "react";
import {Product} from "../../types"

interface ProductListProps {
  products: Product[];
  onRemove: (productId: string, variantId?: string) => void;
}

export default function ProductList({products, onRemove}: ProductListProps) {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  if (!products.length) return null;

  const toggleProduct = (productId: string) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const isExpanded = (productId: string) => expandedProducts.has(productId);

  return (
    <s-section padding="none">
      <s-box
        background="strong"
        border="base"
        borderRadius="base"
        borderStyle="solid"
        overflow="hidden"
      >
        <s-table>
          <s-table-header-row>
            <s-table-header listSlot="primary">Product</s-table-header>
            <s-table-header>
              <s-stack alignItems="end">Actions</s-stack>
            </s-table-header>
            <s-table-header listSlot="secondary">
              <s-stack direction="inline" alignItems="end"/>
            </s-table-header>
          </s-table-header-row>
          <s-table-body>
            {products.map(product => (
              <>
                <s-table-row key={product.id}>
                  <s-table-cell>
                    <s-stack
                      direction="inline"
                      gap="base"
                      alignItems="center"
                    >
                      <s-button
                        icon={isExpanded(product.id) ? "chevron-up" : "chevron-down"}
                        variant="tertiary"
                        onClick={() => toggleProduct(product.id)}
                        accessibilityLabel={
                          isExpanded(product.id)
                            ? `Collapse ${product.title} variants`
                            : `Expand ${product.title} variants`
                        }
                      />
                      <s-box
                        border="base"
                        borderRadius="base"
                        overflow="hidden"
                        maxInlineSize="40px"
                        maxBlockSize="40px"
                      >
                        <s-image
                          alt={product.images[0].altText}
                          src={product.images[0].originalSrc}
                        />
                      </s-box>
                      <s-stack>
                        <s-text>{product.title}</s-text>
                        <s-text
                          color={"subdued"}>{`${product.variants.length} of ${product.totalVariants} variants selected`}</s-text>
                      </s-stack>
                    </s-stack>
                  </s-table-cell>
                  <s-table-cell>
                    <s-stack alignItems="end">
                      <s-link>Preview</s-link>
                    </s-stack>
                  </s-table-cell>
                  <s-table-cell>
                    <s-stack alignItems="end">
                      <s-button
                        icon="x"
                        tone="neutral"
                        variant="tertiary"
                        accessibilityLabel={`Remove ${product.title} product`}
                        onClick={() => onRemove(product.id)}
                      />
                    </s-stack>
                  </s-table-cell>
                </s-table-row>

                {isExpanded(product.id) && product.variants.map((variant) => (
                  <s-table-row key={variant.id}>
                    <s-table-cell>
                      <s-stack
                        direction="inline"
                        gap="base"
                        alignItems="center"
                      >
                        <s-box
                          border="base"
                          borderRadius="base"
                          overflow="hidden"
                          maxInlineSize="40px"
                          maxBlockSize="40px"
                        >
                          {variant.image ? (
                            <s-image
                              alt={variant.image.altText}
                              src={variant.image.originalSrc}
                            />
                          ) : (
                            <s-image
                              alt={product.images[0].altText}
                              src={product.images[0].originalSrc}
                            />
                          )}
                        </s-box>
                        <s-stack>
                          <s-text>{variant.title}</s-text>
                          <s-text color={"subdued"}>${variant.price}</s-text>
                        </s-stack>
                      </s-stack>
                    </s-table-cell>
                    <s-table-cell>
                      <s-stack alignItems="end">
                        <s-link>Preview</s-link>
                      </s-stack>
                    </s-table-cell>
                    <s-table-cell>
                      <s-stack alignItems="end">
                        <s-button
                          icon="x"
                          tone="neutral"
                          variant="tertiary"
                          accessibilityLabel={`Remove ${variant.title}`}
                          onClick={() => onRemove(product.id, variant.id)}
                        />
                      </s-stack>
                    </s-table-cell>
                  </s-table-row>
                ))}
              </>
            ))}
          </s-table-body>
        </s-table>
      </s-box>
    </s-section>
  );
}
