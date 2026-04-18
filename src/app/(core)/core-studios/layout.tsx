import CoreCartProvider from "../_components/cart/CoreCartProvider";
import FooterCore from "../_components/layout/FooterCore";
import HeaderCore from "../_components/layout/HeaderCore";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CoreCartProvider>
      <HeaderCore />
      <div className="flex-grow">{children}</div>
      <FooterCore />
    </CoreCartProvider>
  );
}
