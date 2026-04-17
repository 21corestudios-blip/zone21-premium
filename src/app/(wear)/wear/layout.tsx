import WearCartProvider from "../_components/cart/WearCartProvider";
import FooterWear from "../_components/layout/FooterWear";
import HeaderWear from "../_components/layout/HeaderWear";

export default function WearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WearCartProvider>
      <HeaderWear />
      <div className="flex-grow">{children}</div>
      <FooterWear />
    </WearCartProvider>
  );
}
