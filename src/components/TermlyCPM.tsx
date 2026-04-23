'use client'

import { useEffect, useMemo, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const SCRIPT_SRC_BASE = 'https://app.termly.io';
const TERMLY_WEBSITE_UUID = '08009e5e-79f6-4f41-8581-4961c01deac5';

declare global {
  interface Window {
    TERMLY_CUSTOM_BLOCKING_MAP?: Record<string, string>;
  }
}

interface TermlyCMPProps {
  autoBlock?: boolean;
  masterConsentsOrigin?: string;
}

export default function TermlyCMP({ autoBlock = true, masterConsentsOrigin }: TermlyCMPProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isScriptAdded = useRef(false);

  const scriptSrc = useMemo(() => {
    const src = new URL(SCRIPT_SRC_BASE);
    src.pathname = `/resource-blocker/${TERMLY_WEBSITE_UUID}`;
    autoBlock && src.searchParams.set('autoBlock', 'on');
    masterConsentsOrigin && src.searchParams.set('masterConsentsOrigin', masterConsentsOrigin);
    return src.toString();
  }, [autoBlock, masterConsentsOrigin, TERMLY_WEBSITE_UUID]);

  useEffect(() => {
    if (isScriptAdded.current) return;

    window.TERMLY_CUSTOM_BLOCKING_MAP = {
      "storage.googleapis.com": "essential"
    };

    const script = document.createElement('script');
    script.src = scriptSrc;
    document.head.appendChild(script);
    isScriptAdded.current = true;
  }, [scriptSrc])

  useEffect(() => {
    (window as any).Termly?.initialize()
  }, [pathname, searchParams])

  return null
}