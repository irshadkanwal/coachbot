import { Field, useField, useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import FormInput from "./Input";
import { twMerge } from "tailwind-merge";

export interface RadioOption {
  labelKey?: string;
  label?: string;
  value: any;
}

interface FormRadioGroupProps {
  className?: string;
  name: string;
  type?: string;
  labelKey?: string;
  titleKey?: string;
  options: RadioOption[];
  multiple?: boolean;
  cancellable?: boolean;
}

export default function FormRadioGroup({ className, name, titleKey, labelKey, options, multiple = false, cancellable = false }: FormRadioGroupProps) {
  const t = useTranslations();
  const formik = useFormikContext();
  const [field, meta, helpers] = useField(name);
  const fieldRef = useRef<HTMLDivElement>(null);
  const { setValue } = helpers;

  const handleCheckboxChange = (value: any) => {
    const currentValue = field.value || [];
    const isValueExist = currentValue.some((val: string) => val.includes(value));
    const updatedValue = isValueExist ? currentValue.filter((item: string) => !item.includes(value)) : [...currentValue, value];

    setValue(updatedValue);
  };

  const getIsChecked = useCallback(
    (value: string) => multiple ? field.value?.some((val: string) => val.includes(value)) : field.value?.includes(value),
    [field.value, multiple],
  );

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const otherValue = e.target.value;

    if (!multiple) {
      return setValue(`Other: ${otherValue}`);
    }

    const filteredValue = (field.value || []).filter((value: string) => !value.includes('Other'));
    setValue([...filteredValue, `Other: ${otherValue}`]);
  };

  const handleRadioButton = (e: any, value: any) => {
    if (cancellable && field.value === value) {
      return setValue('');
    }

    field.onChange(e)
  }

  useEffect(() => {
    const firstError = Object.keys(formik.errors)[0];

    if (formik.isSubmitting && firstError === name) {
      fieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [meta.error, formik.isSubmitting, name, formik.errors])

  return (
    <div ref={fieldRef} className={twMerge("flex flex-col gap-y-6", className)}>
      {titleKey && <h5 className="text-medium font-medium text-main">{t(titleKey)}</h5>}

      <div className="flex flex-col text-light-gray text-base gap-y-5">
        {labelKey && t(labelKey)}

        <div role="group" aria-labelledby={`${name}-group`} className="flex flex-col gap-y-5 w-fit">
          {options.map((option: RadioOption) => (
            <label key={option.value} className={twMerge(
              "inline-flex gap-x-2 items-center hover:text-storm-gray cursor-pointer ",
              getIsChecked(option.value) && 'text-main hover:text-main'
            )}>
              <Field
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={option.value}
                checked={getIsChecked(option.value)}
                onChange={() => multiple && handleCheckboxChange(option.value)}
                onClick={(e: any) => !multiple && handleRadioButton(e, option.value)}
                className="relative inline-flex items-center justify-center appearance-none bg-transparent border-1 border-main rounded-full shrink-0 focus:no-outline focus:bg-transparent checked:bg-transparent checked:border-main checked:text-main checked:hover:text-main checked:hover:border-main checked:hover:bg-transparent checked:focus:bg-transparent checked:focus:border-main checked:bg-none checked:after:size-2 checked:after:bg-main checked:after:rounded-full checked:after:block"
              />
              {option.labelKey ? t(option.labelKey) : option.label}
            </label>
          ))}
        </div>

        {getIsChecked('Other') && (
          <FormInput
            name={`${name}Other`}
            placeholderKey="Landing.Studio.Signup.form.otherInputPlaceholder"
            className="w-full"
            onChange={handleOtherChange}
          />
        )}

        {meta.touched && meta.error && <div className="text-salmon">{t(meta.error)}</div>}
      </div>
    </div>
  );
}
