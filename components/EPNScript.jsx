"use client";

import { useEffect } from "react";

export default function EPNScript() {
  // Add this useEffect to check if EPN is loaded
  useEffect(() => {
    const checkEPN = setInterval(() => {
      if (window._epn) {
        console.log("EPN loaded successfully!", window._epn);
        clearInterval(checkEPN);
      }
    }, 1000);

    return () => clearInterval(checkEPN);
  }, []);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window._epn = {campaign: 5339089325};`,
        }}
      />
      <script src="https://epnt.ebay.com/static/epn-smart-tools.js" async />
    </>
  );
}
