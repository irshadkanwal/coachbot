import { PrivateLayout, PublicLayout } from "@/components/shared/Layout";
import { auth0 } from "lib/auth0";

import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth0.getSession();

  return (
    <>
      {session?.user
        ? <PrivateLayout>{children}</PrivateLayout>
        : <PublicLayout>{children}</PublicLayout>
      }
    </>
  );
}