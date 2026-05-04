export function resolvePreviewPath(slug: string | null) {
  const cleanSlug = (slug || "home").replace(/^\/+|\/+$/g, "");

  if (!cleanSlug || cleanSlug === "home") {
    return "/";
  }

  return `/${cleanSlug}`;
}

export function isValidPreviewSecret(secret: string | null) {
  const expectedSecret = process.env.STORYBLOK_PREVIEW_SECRET;
  return Boolean(expectedSecret && secret && secret === expectedSecret);
}
