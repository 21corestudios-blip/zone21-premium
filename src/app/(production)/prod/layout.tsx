import ProductionCartProvider from "../_components/cart/ProductionCartProvider";
import FooterProduction from "../_components/layout/FooterProduction";
import HeaderProduction from "../_components/layout/HeaderProduction";

export default function ProductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProductionCartProvider>
      <HeaderProduction />
      <div className="flex-grow">{children}</div>
      <FooterProduction />
    </ProductionCartProvider>
  );
}
