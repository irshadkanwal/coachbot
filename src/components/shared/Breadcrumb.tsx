'use client'

import React, { ReactNode } from 'react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

type TBreadCrumbProps = {
    homeElement: ReactNode,
    separator: ReactNode,
    containerClasses?: string,
    listClasses?: string,
    activeClasses?: string,
    capitalizeLinks?: boolean
}

/**
 * Next.js Breadcrumb component
 */
export const Breadcrumb = ({ homeElement, separator, containerClasses, listClasses, activeClasses, capitalizeLinks }: TBreadCrumbProps) => {
    const paths = usePathname();
    const pathNames = paths.split("/").filter((path) => path);
  
    const getBreadcrumbItem = (link: string, index: number) => {
      const href = `/${pathNames.slice(0, index + 1).join("/")}`;
      const itemClasses =
        paths === href ? `${listClasses} ${activeClasses}` : listClasses;
      const itemLink = capitalizeLinks
        ? link[0].toUpperCase() + link.slice(1, link.length)
        : link;
      return (
        <React.Fragment key={index}>
          <li className={itemClasses}>
            <Link href={href}>{itemLink}</Link>
          </li>
          {pathNames.length !== index + 1 && separator}
        </React.Fragment>
      );
    };
  
    return (
      <div className='md:px-10 lg:px-0'>
        <ul className={containerClasses}>
          <li className={listClasses}>
            <Link href={"/"}>{homeElement}</Link>
          </li>
          {pathNames.length > 0 && separator}
          {pathNames.map(getBreadcrumbItem)}
        </ul>
      </div>
    );
  };