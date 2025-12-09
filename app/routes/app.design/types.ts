export interface DesignSettings {
  title: string;
  subtitle: string;
  button: string;
  headerColors: {
    title: string;
    subtitle: string;
    background: string;
  };
  bodyColors: {
    background: string;
    border: string;
    buttonBg: string;
    buttonText: string;
  };
  radius: {
    atc: number;
    popup: number;
    productCard: number;
  }
}

export interface DesignSettingsPayload {
  offers_design: DesignSettings;
  picker_design: DesignSettings;
}
