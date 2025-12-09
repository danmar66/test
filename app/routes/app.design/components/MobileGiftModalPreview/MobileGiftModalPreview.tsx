import {DesignSettings} from "../../types";
import "../../style.css";
import {Checkbox, Icon} from "@shopify/polaris";
import {XIcon} from "@shopify/polaris-icons";

export default function MobileGiftModalPreview({settings}: { settings: DesignSettings }) {
  const {title, subtitle, button, headerColors, bodyColors, radius} = settings;

  const subtitleText = subtitle || "Select up to 2 gifts for your order.";

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

  return (
    <div className="mobile-gift-modal__wrapper">
      <div className="mobile-gift-modal__spacer"/>
      <div
        className="mobile-gift-modal"
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

        <div
          className="mobile-gift-modal__list"
          style={{backgroundColor: bodyColors.background}}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              className="gift-card"
              key={i}
              style={i === 1 ? selectedGiftStyle : {}}
            >
              <div className="gift-card__image">
                <img src="https://placehold.co/60x60?text=Gift" alt="Gift"/>
              </div>

              <div className="gift-card__content">
                <div className="gift-card__top">
                  <div>
                    <p className="gift-card__name">Heavy Loose Fit Wash T-Shirt</p>
                    <div className="gift-card__prices">
                      <span className="gift-card__new">$0.00</span>
                      <span className="gift-card__old">$28</span>
                    </div>
                  </div>

                  <Checkbox checked={i === 1} label={null}/>
                </div>

                <select className="gift-card__select" >
                  <option>Blue</option>
                  <option>Black</option>
                  <option>Grey</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mobile-gift-modal__footer"
          style={{backgroundColor: bodyColors.background}}
        >
          <div className="gift-modal__selected-count">1/2 Selected</div>

          <button className="gift-modal__footer-button" style={atcStyle}>
            {button}
          </button>
        </div>
      </div>
    </div>
  );
}
