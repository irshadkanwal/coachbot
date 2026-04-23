import { PublicRoutes } from "@models/common.models";
import { redirect, RedirectType } from "next/navigation";

export default function withErrorRedirect<T extends (...args: any[]) => Promise<any> | any>(fn: T) {
  return async function (...args: Parameters<T>): Promise<ReturnType<T> | void> {
    try {
      return await fn(...args);
    } catch {
      return redirect(PublicRoutes.error, RedirectType.push)
    }
  };
}
