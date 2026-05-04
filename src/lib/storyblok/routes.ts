export const editorialStoryblokRoutes = {
  "/": "home",
  "/a-propos": "a-propos",
  "/ecosysteme": "ecosysteme",
  "/contact": "contact",
  "/mentions-legales": "mentions-legales",
} as const;

export type EditorialRoutePath = keyof typeof editorialStoryblokRoutes;

export function getStoryblokSlugForEditorialRoute(pathname: string) {
  const normalizedPathname =
    pathname === "/" ? "/" : pathname.replace(/\/+$/g, "");

  return editorialStoryblokRoutes[
    normalizedPathname as EditorialRoutePath
  ] as string | undefined;
}

export function isEditorialStoryblokRoute(pathname: string) {
  return Boolean(getStoryblokSlugForEditorialRoute(pathname));
}
