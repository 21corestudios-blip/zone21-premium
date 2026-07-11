import { siteConfig } from "@/config/site";

import JsonLd from "./JsonLd";

export default function OrganizationJsonLd() {
  const organizationId = `${siteConfig.url}/#organization`;
  const websiteId = `${siteConfig.url}/#website`;

  return (
    <JsonLd
      id="arcane-organization-jsonld"
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": organizationId,
            name: siteConfig.name,
            legalName: siteConfig.legalName,
            url: siteConfig.url,
            logo: `${siteConfig.url}${siteConfig.logo}`,
            description: siteConfig.description,
          },
          {
            "@type": "WebSite",
            "@id": websiteId,
            url: siteConfig.url,
            name: siteConfig.name,
            inLanguage: siteConfig.language,
            publisher: {
              "@id": organizationId,
            },
          },
        ],
      }}
    />
  );
}
