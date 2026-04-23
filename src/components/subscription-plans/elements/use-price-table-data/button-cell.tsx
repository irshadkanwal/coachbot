import { Button } from "@/components/shared/Button";
import { ModalButton } from "@/components/shared/FunctionalButtons";
import { Variant } from "@/components/shared/Modal";
import { useTranslations } from "next-intl";
import { memo } from "react";

const classNames = {
  baseButtonCell: "w-full py-2 px-3 font-bold text-base md:text-lg text-white text-nowrap",
  freeButtonCell: "w-full py-2 px-3 font-bold text-base md:text-lg text-storm-gray pointer-events-none border-storm-gray text-nowrap",
};

interface CommonProps {
  onClick: () => void;
  name?: string;
}

interface CommonButtonCellProps extends CommonProps {
  title?: string;
  t?: any;
  isFree?: boolean;
}

interface ButtonCellProps extends CommonProps {
  isActive: boolean;
  isFree: boolean;
}

const BaseButtonCell = memo(function ({ title, onClick }: CommonButtonCellProps) {
  return (
    <Button variant="solid" color="primary" className={classNames.baseButtonCell} onClick={onClick}>
      {title}
    </Button>
  );
});
BaseButtonCell.displayName = "BaseButtonCell";

const ActiveButtonCell = memo(function ({ name, t, onClick, isFree }: CommonButtonCellProps) {
  const config = {
    title: t('Subscriptions.unsubscribeModal.title'),
    buttonTitle: t('Subscriptions.unsubscribeModal.buttonTitle'),
    cancelButtonTitle: t('Subscriptions.unsubscribeModal.cancelButton'),
    variant: "yellow" as Variant,
    confirm: onClick
  }

  return isFree
    ? <Button variant="outline" color="gray" className={classNames.freeButtonCell} onClick={onClick}>
      {t('Subscriptions.Prices.activePriceButton')}
    </Button>
    : <ModalButton
      buttonText={t("Subscriptions.cancelSubscriptionButton")}
      config={config}
      variant="outline"
      color="yellow"
      className="border-yellow py-2 font-bold text-yellow w-full"
      type='dialog'
    >
      <p className="text-main">{t('Subscriptions.unsubscribeModal.contentKey', { name })}</p>
    </ModalButton>;
});

export function ButtonCell({ isActive, isFree, name, onClick }: ButtonCellProps) {
  const t = useTranslations();

  return isActive ? (
    <ActiveButtonCell onClick={onClick} t={t} isFree={isFree} name={name} />
  ) : (
    <BaseButtonCell onClick={onClick} title={t("Subscriptions.Prices.newPriceButton")} />
  );
}
