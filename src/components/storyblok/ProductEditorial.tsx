import BrandIntro from "@/components/storyblok/BrandIntro";
import type { ProductEditorialBlok } from "@/lib/storyblok/types";

export default function ProductEditorial({
  blok,
}: {
  blok: ProductEditorialBlok;
}) {
  return <BrandIntro blok={{ ...blok, component: "brandIntro" }} />;
}
