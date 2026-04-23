'use client';

import { ErrorPage } from "@/components/shared/ErrorPage";
import { PrivateLayout, PublicLayout } from "@/components/shared/Layout";
import { useUser } from "@auth0/nextjs-auth0";
import { useMemo } from "react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  const { user } = useUser();

  const memoizedErrorPage = useMemo(
    () => (<ErrorPage reset={reset} userLoggedIn={!!user} />),
    [user],
  );

  return (
    <>{user
      ? <PrivateLayout>{memoizedErrorPage}</PrivateLayout>
      : <PublicLayout>{memoizedErrorPage}</PublicLayout>
    }</>
  );
}