import React, { useEffect, useState, useRef } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { AsYouType, CountryCode, getCountries, getCountryCallingCode, isValidNumber, parsePhoneNumberWithError } from 'libphonenumber-js';
import { useLocale } from 'next-intl';
import SearchableList from './SearchableList';

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
}
interface CountryOption {
  id: CountryCode;
  name: string;
  code: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const locale = useLocale();
  const [country, setCountry] = useState<CountryOption>({} as CountryOption);
  const [phone, setPhone] = useState('');
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const displayNames = new Intl.DisplayNames([locale || 'en'], { type: 'region' });
    const countries = getCountries().map((countryCode: CountryCode) => {
      const callingCode = getCountryCallingCode(countryCode);
      const countryName = displayNames.of(countryCode);

      return { id: countryCode, code: `+${callingCode}`, name: countryName || '' };
    });

    setCountry(countries[0]);
    setPhone(countries[0].code);
    setCountryOptions(countries);
  }, [locale]);

  useEffect(() => {
    if (!value) {
      return;
    }

    try {
      const parsedNumber = parsePhoneNumberWithError(value);
      let formattedNumber = '';

      if (parsedNumber) {
        const filteredCountry = countryOptions.find(c => c.id === parsedNumber.country);
        formattedNumber = parsedNumber.formatInternational();

        filteredCountry && setCountry(filteredCountry);
      }

      setPhone(formattedNumber || value);
    } catch {
      setPhone(value);
    }
  }, [value, countryOptions]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const asYouType = new AsYouType(country.id);
    const formattedValue = asYouType.input(rawValue);
    const parsedNumber = asYouType.getNumber();

    if (parsedNumber) {
      const detectedCountryCode = parsedNumber.country;
      const selectedCountry = countryOptions.find((option) => option.id === detectedCountryCode);

      selectedCountry && setCountry(selectedCountry);
    }

    setPhone(formattedValue);
    onChange(parsedNumber && isValidNumber(parsedNumber?.number, country.id) ? parsedNumber.format('E.164') : '');
  };

  const handleSelect = (selectedCountry: CountryOption) => {
    setCountry(selectedCountry);
    setPhone(selectedCountry?.code);
    inputRef?.current?.focus();
  };

  return (
    <div className="relative flex flex-grow w-full shrink items-center gap-4 rounded-lg outline outline-1 outline-light-gray px-2 py-1.5">
      <SearchableList
        selected={country}
        options={countryOptions}
        onSelect={handleSelect}
        className='w-full'
        selectedOptionTemplate={(option) => (
          <ReactCountryFlag countryCode={option?.id?.toUpperCase()} svg className='!size-5' />
        )}
        optionTemplate={(option) => (
          <div className="flex justify-between gap-x-2">
            <div className="flex gap-x-2 text-base font-medium">
              <ReactCountryFlag countryCode={option.id.toUpperCase()} svg className='!size-6' />
              <p>{option.name} <span>({option.id})</span></p>
            </div>
            <span>{option.code}</span>
          </div>
        )}
      />

      <input
        ref={inputRef}
        type="text"
        value={phone}
        onChange={handlePhoneChange}
        className="flex-grow border-none bg-transparent p-0 text-medium focus:no-outline"
      />
    </div>
  );
};

export default PhoneInput;