import { Field, useField, useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface FormInputProps {
  className?: string;
  name: string;
  type?: string;
  rows?: number;
  component?: string;
  labelKey?: string;
  placeholderKey?: string;
  disabled?: boolean;
  readonly?: boolean;
  onChange?: (e: any) => void;
}

export default function FormInput({ disabled, readonly, rows, component, className, name, labelKey, placeholderKey, onChange, type = 'text' }: FormInputProps) {
  const t = useTranslations();
  const [field, meta] = useField(name);
  const formik = useFormikContext();
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstError = Object.keys(formik.errors)[0];

    if (formik.isSubmitting && firstError === name) {
      fieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [meta.error, formik.isSubmitting, name, formik.errors])

  return (
    <div ref={fieldRef} className="flex flex-col w-full min-h-0 h-max gap-y-2">
      <label className={twMerge('flex flex-col text-light-gray text-base gap-y-3', className)}>
        {labelKey && t(labelKey)}
        <Field
          disabled={disabled}
          readOnly={readonly}
          onChange={(e: any) => onChange ? onChange(e) : field.onChange(e)}
          component={component}
          rows={rows}
          name={name}
          type={type}
          placeholder={t(placeholderKey)}
          className={twMerge(
            'rounded-lg border-gray-border bg-white-opacity-2 px-4 py-2 focus:ring-1 focus:ring-storm-gray focus:no-outline placeholder:text-storm-gray text-lg lg:text-medium text-main disabled:cursor-not-allowed disabled:opacity-60',
            meta.touched && meta.error && 'ring-1 ring-salmon'
          )} />
      </label>

      {meta.touched && meta.error ? <div className="text-salmon">{t(meta.error)}</div> : null}
    </div>
  );
}