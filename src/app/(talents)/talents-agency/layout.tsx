import TalentsCartProvider from "../_components/cart/TalentsCartProvider";
import FooterTalents from "../_components/layout/FooterTalents";
import HeaderTalents from "../_components/layout/HeaderTalents";

export default function TalentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TalentsCartProvider>
      <HeaderTalents />
      <div className="flex-grow">{children}</div>
      <FooterTalents />
    </TalentsCartProvider>
  );
}
