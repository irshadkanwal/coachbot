import { Button } from "@/components/shared/Button";
import { Notification } from "@/components/shared/Notification";
import { useTranslations } from "next-intl";

export function UpgradeNotification({ 
    isFreePlan, 
    onShowOverlay 
  }: { 
    isFreePlan: boolean; 
    onShowOverlay: () => void; 
  }) {
    const t = useTranslations();
    
    if (!isFreePlan) return null;
  
    return (
      <div className="ml-auto flex w-fit shrink-0 cursor-pointer self-end" onClick={onShowOverlay}>
        {/* <Notification
          text={t('Common.upgradeSubscription.freePlanNotification')}
          variant="violet"
          closeButton={true}
          onClose={() => {}}
        >
          <Button className="m-0 mx-2 bg-transparent p-0 font-semibold hover:bg-transparent hover:text-light-gray">
            {t('Common.upgradeSubscription.upgradeButtonTitle')}
          </Button>
        </Notification> */}
      </div>
    );
  }
  