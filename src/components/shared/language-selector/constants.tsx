import ReactCountryFlag from "react-country-flag";

import { Language, Locale } from "@models/locale.models";
import type { JSX } from "react";

const iconStyle = {
  fontSize: 30,
}

export const localeIcons: Record<Locale, JSX.Element> = {
  de: <ReactCountryFlag alt={Language.de} countryCode={'DE'} style={iconStyle} />,
  en: <ReactCountryFlag alt={Language.en} countryCode={'GB'} style={iconStyle} />,
  es: <ReactCountryFlag alt={Language.es} countryCode={'ES'} style={iconStyle} />,
  fr: <ReactCountryFlag alt={Language.fr} countryCode={'FR'} style={iconStyle} />,
  it: <ReactCountryFlag alt={Language.it} countryCode={'IT'} style={iconStyle} />,
  pl: <ReactCountryFlag alt={Language.pl} countryCode={'PL'} style={iconStyle} />,
  uk: <ReactCountryFlag alt={Language.uk} countryCode={'UA'} style={iconStyle} />,
};