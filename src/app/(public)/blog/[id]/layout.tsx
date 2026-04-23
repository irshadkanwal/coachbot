import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { Breadcrumb } from "@/components/shared/Breadcrumb";

const classNames = {
  root: "max-xl:mx-10 mx-auto px-4 lg:max-w-4xl lg:px-0 xl:max-w-6xl 2xl:max-w-7xl relative w-full md:mb-5 md:px-0 lg:mb-8",
  containerClasses: "flex items-center -mx-2 pb-5 text-storm-gray",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={classNames.root}>
      <Breadcrumb
        homeElement={"Homepage"}
        separator={<ChevronRightIcon className="size-5 pt-1" />}
        activeClasses="text-white"
        containerClasses={classNames.containerClasses}
        listClasses="hover:underline mx-2"
        capitalizeLinks
      />
      {children}
    </div>
  );
}
