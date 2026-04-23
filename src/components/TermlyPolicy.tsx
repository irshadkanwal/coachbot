'use client';

import React, { useEffect } from 'react';

interface TermlyPolicyProps {
  dataId: string;
}

const TermlyPolicy: React.FC<TermlyPolicyProps> = ({ dataId }) => {
  useEffect(() => {
    const scriptId = 'termly-jssdk';

    const insertScript = () => {
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://app.termly.io/embed-policy.min.js";
        script.async = true;
        document.body.appendChild(script);
      };
    };

    insertScript();

    return () => {
      const script = document.getElementById(scriptId);

      if (script) script.remove();
    };
  }, [dataId]);

  return (
    <main className="flex flex-col mx-auto w-full max-w-5xl py-10 px-6 lg:px-20">
      <div name="termly-embed" data-id={dataId}></div>
    </main>
  );
};

export default TermlyPolicy;
