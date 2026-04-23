import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useField } from "formik";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CheckboxField({ name, labelKey, href, ...props }: { name: string, labelKey: string, href?: string }) {
  const t = useTranslations();

  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={field.value}
          onChange={setValue}
          {...props}
          className="group relative flex size-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border border-dark-aquamarine data-[checked]:border-none data-[checked]:bg-dark-aquamarine"
        >
          {field.value && <CheckIcon className="absolute inset-0 m-auto h-4 w-4 text-gunmetal" />}
        </Checkbox>
        <span className="text-base text-light-gray">
          {t.rich(labelKey, { link: chunk => href ? <Link className="underline underline-offset-4 text-main" target="_blank" href={href}>{chunk}</Link> : chunk })}
        </span>
      </div>
      {meta.touched && meta.error && <div className="text-salmon">{t(meta.error)}</div>}
    </div>
  );
}
