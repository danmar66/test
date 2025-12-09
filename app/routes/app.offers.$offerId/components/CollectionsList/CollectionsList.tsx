import {Collection} from "../../types"

interface CollectionsListProps {
  collections: Collection[];
  onRemove: (collectionId: string) => void;
}

export default function CollectionsList({ collections, onRemove }: CollectionsListProps) {
  if (!collections.length) return null;

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
            <s-table-header listSlot="primary">Collection</s-table-header>
            <s-table-header>
              <s-stack alignItems="end">Actions</s-stack>
            </s-table-header>
            <s-table-header listSlot="secondary">
              <s-stack direction="inline" alignItems="end"/>
            </s-table-header>
          </s-table-header-row>
          <s-table-body>
            {collections.map(collection => (
              <s-table-row key={collection.id}>
                <s-table-cell>
                  <s-stack direction="inline" gap="small" alignItems="center">
                    {collection.image && (
                      <s-box
                        border="base"
                        borderRadius="base"
                        overflow="hidden"
                        maxInlineSize="40px"
                        maxBlockSize="40px"
                      >
                        <s-image
                          src={collection.image.originalSrc}
                          alt={collection.image.altText}
                          aspectRatio="1/1"
                          objectFit="cover"
                        />
                      </s-box>
                    )}
                    {!collection.image && (
                      <s-box
                        border="base"
                        borderRadius="base"
                        overflow="hidden"
                        maxInlineSize="40px"
                        maxBlockSize="40px"
                      >
                        <s-stack alignItems="center" justifyContent="center" inlineSize="40px" blockSize="40px">
                          <s-icon type={"image"} />
                        </s-stack>
                      </s-box>
                    )}
                    <s-text>{collection.title}</s-text>
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
                      accessibilityLabel={`Remove ${collection.id} product`}
                      onClick={() => onRemove(collection.id)}
                    />
                  </s-stack>
                </s-table-cell>
              </s-table-row>
            ))}
          </s-table-body>
        </s-table>
      </s-box>
    </s-section>
  )
}
