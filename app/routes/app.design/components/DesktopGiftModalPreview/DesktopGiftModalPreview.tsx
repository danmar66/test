import {DesignSettings} from "../../types";
import "../../style.css"
import {XIcon} from "@shopify/polaris-icons";
import {Checkbox, Icon} from "@shopify/polaris";

export default function DesktopGiftModalPreview({ settings }: { settings: DesignSettings }) {
  const { title, subtitle, button, headerColors, bodyColors, radius } = settings;

  const subtitleText = subtitle || "Select up to 2 gifts from the options below.";

  const selectedGiftStyle = {
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
    { id: 1, title: "Heavy Loose Fit Wash T-Shirt", price: 0, oldPrice: 28, selected: true },
    { id: 2, title: "Heavy Loose Fit Wash T-Shirt", price: 0, oldPrice: 28 },
    { id: 3, title: "Heavy Loose Fit Wash T-Shirt", price: 0, oldPrice: 28 },
    { id: 4, title: "Heavy Loose Fit Wash T-Shirt", price: 0, oldPrice: 28 },
    { id: 5, title: "Heavy Loose Fit Wash T-Shirt", price: 0, oldPrice: 28 },
  ];

  return (
    <div className="desktop-gift-modal__wrapper">
      <div
        className="desktop-gift-modal"
        style={{
          borderRadius: radius.popup ?? "16px",
          backgroundColor: bodyColors.background,
        }}
      >

        <div
          className="gift-modal__header gift-modal__header__desktop"
          style={{backgroundColor: headerColors.background}}
        >
            <button className="gift-modal__close gift-modal__close__desktop">
              <Icon source={XIcon} />
            </button>
          <div className="gift-modal__headerContent">
            <p className="gift-modal__title" style={{color: headerColors.title}}>
              {title}
            </p>
            <p className="gift-modal__subtitle" style={{color: headerColors.subtitle}}>
              {subtitleText}
            </p>
          </div>
        </div>

        <div className="desktop-gift-modal__scroll">
          {mockProducts.map((p) => (
            <div
              key={p.id}
              className={
                "desktop-gift-item" +
                (p.selected ? " desktop-gift-item--selected" : "")
              }
              style={p.selected ? selectedGiftStyle : {}}
            >
              <div className="desktop-gift-item__left">
                <div className="desktop-gift-item__image" />

                <div className="desktop-gift-item__info">
                  <div className="desktop-gift-item__name">{p.title}</div>

                  <div className="desktop-gift-item__prices">
                    <span className="desktop-gift-item__new-price">$0.00</span>
                    <span className="desktop-gift-item__old-price">${p.oldPrice}</span>
                  </div>

                  {p.selected && (
                    <select className="desktop-gift-item__select">
                      <option>Blue</option>
                      <option>Gray</option>
                      <option>Green</option>
                    </select>
                  )}
                </div>
              </div>

              <div>
                <Checkbox checked={p.id === 1} label={null} />
              </div>
            </div>
          ))}
        </div>

        <div className="desktop-gift-modal__footer">
          <div className="gift-modal__selected-count">1/2 Selected</div>

          <button
            className="desktop-gift-modal__footer-btn"
            style={atcStyle}
          >
            {button}
          </button>
        </div>

      </div>
    </div>
  );
}
