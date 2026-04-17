import FooterWear from "../_components/layout/FooterWear";
import HeaderWear from "../_components/layout/HeaderWear";

export default function WearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderWear />
      <main className="flex-grow">{children}</main>
      <FooterWear />
    </>
  );
}
