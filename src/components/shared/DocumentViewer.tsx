'use client';

import { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import Loader from '@/components/shared/Loader';

interface DocumentViewerProps {
  documentPath: string;
}

export default function DocumentViewer({ documentPath }: DocumentViewerProps) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(documentPath);
        if (!response.ok) {
          throw new Error('File not found');
        }
        const arrayBuffer = await response.arrayBuffer();

        if (containerRef.current) {
          await renderAsync(arrayBuffer, containerRef.current, undefined, {
            className: 'coachbot-docs',
            inWrapper: false,
            ignoreWidth: true,
            ignoreHeight: true,
            experimental: true,
            useBase64URL: true,
            renderHeaders: false,
            renderFooters: false,
            renderFootnotes: false,
            renderEndnotes: false,
            debug: true,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error processing the document:', err);
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentPath]);

  return (
    <>
      <div className="documents-container mx-auto h-full min-h-0 min-w-0 max-w-[100dvw] px-7 text-justify md:px-16 lg:max-w-5xl 2xl:max-w-7xl">
        {loading && (
          <div className="flex-center h-full gap-y-7">
            <Loader />
          </div>
        )}
        <div ref={containerRef}></div>
      </div>
    </>
  );
}