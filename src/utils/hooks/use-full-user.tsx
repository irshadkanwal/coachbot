import { useCallback, useEffect, useState } from "react";

import { getFullUser } from "@/server/actions/userActions";
import { User } from "@models/data.models";

export interface FullUserHook {
  data: User | null;
  isLoading: boolean;
}

export function useFullUser() {
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const retrieveUserData = useCallback(async () => {
    setIsLoading(true);
    const user = await getFullUser();
    setData(user);
    setIsLoading(false);
  }, [])

  useEffect(() => {
    retrieveUserData();
  }, [retrieveUserData]);

  return { data, isLoading };
}
