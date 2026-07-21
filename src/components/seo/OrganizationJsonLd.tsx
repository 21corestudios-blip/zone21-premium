import JsonLd from "./JsonLd";

type OrganizationJsonLdProps = {
  siteUrl: string;
};

function withoutTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

export default function OrganizationJsonLd({
  siteUrl,
}: OrganizationJsonLdProps) {
  const normalizedSiteUrl = withoutTrailingSlash(siteUrl);
  const organizationId = `${normalizedSiteUrl}/#organization`;
  const websiteId = `${normalizedSiteUrl}/#website`;

  return (
    <JsonLd
      id="zone21-organization-jsonld"
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": organizationId,
            name: "ARCANE",
            url: normalizedSiteUrl,
            logo: `${normalizedSiteUrl}/images/ui/ARCANE_LOGO_PRINCIPAL_BLANC_v2.svg`,
            description:
              "Maison créative indépendante dédiée aux univers premium entre vêtement, image, musique, production, talents et culture street.",
          },
          {
            "@type": "WebSite",
            "@id": websiteId,
            url: normalizedSiteUrl,
            name: "ARCANE",
            inLanguage: "fr-FR",
            publisher: {
              "@id": organizationId,
            },
          },
        ],
      }}
    />
  );
}
