import FooterWear from "@/components/layout/wear/FooterWear";
import HeaderWear from "@/components/layout/wear/HeaderWear";

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
