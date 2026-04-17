import Footer from "./_components/layout/Footer";
import Header from "./_components/layout/Header";

export default function Zone21Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </>
  );
}
