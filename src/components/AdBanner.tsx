import { useEffect } from "react";

export default function AdBanner() {
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

    const container = document.getElementById("ad-container-728x90");
    if (container) {
      container.appendChild(config);
      container.appendChild(script);
    }

    return () => {
      if (container) container.innerHTML = "";
    };
  }, []);

  return <div id="ad-container-728x90" className="flex justify-center my-4"></div>;
}
