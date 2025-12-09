import {DesignSettings} from "../../types";
import "../../style.css";
import {Divider, Icon, ProgressBar} from "@shopify/polaris";
import {XIcon} from "@shopify/polaris-icons";

export default function MobileTodaysOffersPreview({settings}: { settings: DesignSettings }) {
  const {title, subtitle, button, headerColors, bodyColors, radius} = settings;

  const subtitleText = subtitle || "Select up to 2 gifts for your order.";

  const selectedOfferStyle = {
    borderRadius: radius.productCard ?? "12px",
    borderColor: bodyColors.border ?? "#000",
    borderWidth: 2,
  }

  const atcStyle = {
    backgroundColor: bodyColors.buttonBg,
    color: bodyColors.buttonText,
    borderRadius: radius.atc ?? "12px",
  }

  const mockProducts = [
    { id: 1, title: "Heavy Loose Fit Wash T-Shirt", price: 0, oldPrice: 28 },
    { id: 2, title: "Heavy Loose Fit Wash T-Shirt", price: 0, oldPrice: 28 },
  ];

  return (
    <div className="mobile-gift-modal__wrapper">
      <div className="mobile-gift-modal__spacer"/>
      <div
        className="mobile-offers-modal"
        style={{
          borderTopRightRadius: radius.popup ?? "16px",
          borderTopLeftRadius: radius.popup ?? "16px",
        }}
      >
        <div
          className="gift-modal__header"
          style={{backgroundColor: headerColors.background}}
        >
          <div className="mobile-gift-modal__bar__wrapper">
            <div className="mobile-gift-modal__bar"></div>
          </div>
          <div className="mobile-gift-modal__close__wrapper">
            <button className="gift-modal__close">
              <Icon source={XIcon} />
            </button>
          </div>
          <div className="gift-modal__headerContent">
            <p className="gift-modal__title" style={{color: headerColors.title}}>
              {title}
            </p>
            <p className="gift-modal__subtitle" style={{color: headerColors.subtitle}}>
              {subtitleText}
            </p>
          </div>
        </div>

        <div className="mobile-offers__body" style={{backgroundColor: bodyColors.background}}>
          <div className={"desktop-offers-item__products"}
          >
            <div className="gift-modal__headerContent">
              <p className="desktop-offers-item__title" style={{color: headerColors.title}}>
                {`Spend USD 2,000 in "T-Shirts" collection`}
              </p>
              <p className="desktop-offers-item__subtitle" style={{color: headerColors.subtitle}}>
                {`and get a FREE gift`}
              </p>
              <div style={{paddingTop: "var(--p-space-200"}}>
                <ProgressBar progress={70} tone="primary" size={"small"} />
              </div>
            </div>

            <Divider borderColor={"border"} />

            <div className="desktop-offers__products-list">
              {mockProducts.map((p) => (
                <div key={p.id} className="desktop-gift-item__left">
                  <div className="desktop-gift-item__image" />

                  <div className="desktop-gift-item__info">
                    <div className="desktop-gift-item__name">{p.title}</div>

                    <div className="desktop-gift-item__prices">
                      <span className="desktop-gift-item__new-price">$0.00</span>
                      <span className="desktop-gift-item__old-price">${p.oldPrice}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="desktop-offers__view-more">See more (1 product) </div>
            </div>

            <button
              className="desktop-gift-modal__footer-btn"
              style={atcStyle}
            >
              {button}
            </button>

          </div>

          <div
            className={"desktop-offers-item__products"}
            style={selectedOfferStyle}
          >
            <div className="gift-modal__headerContent">
              <p className="desktop-offers-item__title" style={{color: headerColors.title}}>
                {`Buy 2 products from t-shirts`}
              </p>
              <p className="desktop-offers-item__subtitle" style={{color: headerColors.subtitle}}>
                {`and get a FREE gift`}
              </p>
            </div>

            <Divider borderColor={"border"} />

            <div className="desktop-offers__products-list">
              {mockProducts.slice(0, 1).map((p) => (
                <div key={p.id} className="desktop-gift-item__left">
                  <div className="desktop-gift-item__image" />

                  <div className="desktop-gift-item__info">
                    <div className="desktop-gift-item__name">{p.title}</div>

                    <div className="desktop-gift-item__prices">
                      <span className="desktop-gift-item__new-price">$0.00</span>
                      <span className="desktop-gift-item__old-price">${p.oldPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
