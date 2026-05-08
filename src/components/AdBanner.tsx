import { useEffect, useState } from "react";

export default function AdBanner() {
  const [adId] = useState(() => `ad-container-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const config = document.createElement("script");
    config.type = "text/javascript";
    config.innerHTML = `
      atOptions = {
        'key' : '1643c699094a5ea6574adf86632472a5',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//www.highperformanceformat.com/1643c699094a5ea6574adf86632472a5/invoke.js";

    const container = document.getElementById(adId);
    if (container) {
      container.appendChild(config);
      container.appendChild(script);
    }

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [adId]);

  return (
    <div className="flex-center" style={{ margin: '2rem 0', minHeight: '90px', width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
      <div id={adId} style={{ maxWidth: '100%' }}></div>
    </div>
  );
}
